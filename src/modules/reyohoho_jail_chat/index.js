'use strict';

// ============================================================================
// ReYohoho Jail Chat (built-in, non-disableable)
//
// Mirrors a relayed "jail" chat over WebSocket into the current channel so the
// relayed messages are visible to everyone in chat, even when the author is
// banned on Twitch. Receive-only: it never sends messages.
// ============================================================================

import Module from 'utilities/module';

const MAX_RECONNECT_DELAY = 30000;

// The jail relay always lives on this starege host.
const RELAY_WS_BASE = 'wss://ext.rte.net.ru:8443';

export default class ReyohohoJailChat extends Module {

	constructor(...args) {
		super(...args);

		// Built-in: always enable, no settings toggle, cannot be turned off.
		this.should_enable = true;

		this.inject('settings');
		this.inject('site');
		this.inject('chat');

		this.socket = null;
		this.connectedChannel = null;
		this.reconnectAttempts = 0;
		this.reconnectTimer = null;
		this.shouldReconnect = false;

		this._contextHandler = null;
	}

	onEnable() {
		this._startChannelWatcher();
		this.sync();
	}

	onDisable() {
		this._stopChannelWatcher();
		this.disconnect();
	}

	// ================================================================
	//  Relay endpoint
	// ================================================================

	_buildRelayWsUrl(channel) {
		return `${RELAY_WS_BASE}/chat-relay/ws?channel=${encodeURIComponent(channel)}`;
	}

	// ================================================================
	//  Channel context
	// ================================================================

	_getCurrentChannel() {
		const login = this.settings.get('context.channel');
		if (!login) return null;
		return {
			login: String(login).toLowerCase(),
			id: this.settings.get('context.channelID') || null
		};
	}

	_startChannelWatcher() {
		this._stopChannelWatcher();
		this._contextHandler = () => this.sync();
		this.settings.main_context.on('context_changed', this._contextHandler);
	}

	_stopChannelWatcher() {
		if (this._contextHandler) {
			this.settings.main_context.off('context_changed', this._contextHandler);
			this._contextHandler = null;
		}
	}

	// ================================================================
	//  Lifecycle
	// ================================================================

	sync() {
		const channel = this._getCurrentChannel();
		const channelName = channel?.login || null;

		if (!channelName) {
			this.disconnect();
			return;
		}

		if (channelName !== this.connectedChannel)
			this.connect(channelName);
	}

	// ================================================================
	//  WebSocket relay
	// ================================================================

	connect(channelName) {
		this.disconnect();

		this.connectedChannel = channelName;
		this.shouldReconnect = true;

		const url = this._buildRelayWsUrl(channelName);

		let socket;
		try {
			socket = new WebSocket(url);
		} catch (e) {
			this.log.warn('Failed to open relay socket', e);
			this.scheduleReconnect();
			return;
		}
		this.socket = socket;

		socket.addEventListener('open', () => {
			this.reconnectAttempts = 0;
			this.log.info(`Relay connected for #${channelName}`);
		});

		socket.addEventListener('message', event => {
			this.handleRelayMessage(channelName, event.data);
		});

		socket.addEventListener('close', () => {
			if (this.socket === socket) {
				this.socket = null;
				this.scheduleReconnect();
			}
		});

		socket.addEventListener('error', () => {
			try {
				socket.close();
			} catch (_) { /* noop */ }
		});
	}

	scheduleReconnect() {
		if (!this.shouldReconnect || !this.connectedChannel) return;
		if (this.reconnectTimer) return;

		const delay = Math.min(1000 * 2 ** this.reconnectAttempts, MAX_RECONNECT_DELAY);
		this.reconnectAttempts += 1;

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			const channel = this._getCurrentChannel();
			const channelName = channel?.login || null;
			if (channelName && channelName === this.connectedChannel)
				this.connect(channelName);
		}, delay);
	}

	disconnect() {
		this.shouldReconnect = false;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		if (this.socket) {
			try {
				this.socket.close();
			} catch (_) { /* noop */ }
			this.socket = null;
		}
		this.connectedChannel = null;
		this.reconnectAttempts = 0;
	}

	handleRelayMessage(channelName, raw) {
		let payload;
		try {
			payload = JSON.parse(raw);
		} catch (_) {
			return;
		}

		if (!payload || payload.type !== 'jail_message') return;

		const current = this._getCurrentChannel();
		if (!current || current.login !== channelName) return;

		this.pushUserMessage({
			id: payload.id,
			twitchId: payload.twitch_id,
			login: payload.login,
			displayName: payload.display_name,
			color: payload.color,
			message: payload.message
		});
	}

	// Inject a synthetic chat line that renders like a regular user message
	// (custom display name + color, with emotes/badges/paints tokenized).
	// Routes the relayed message into FFZ's normal receive pipeline so RTE
	// clients see it even when they (or the author) aren't logged in.
	pushUserMessage({id, twitchId, login, displayName, color, message} = {}) {
		const siteChat = this.resolve('site.chat');
		if (!siteChat) return false;

		const text = typeof message === 'string' ? message : '';
		if (!text) return false;

		const service = siteChat.ChatService?.first;
		if (!service) return false;

		const channelLogin = service.props?.channelLogin;
		const channelID = service.props?.channelID;
		if (!channelLogin) return false;

		const messageType = siteChat.chat_types?.Message;
		if (messageType == null) return false;

		const msgId = id || `rte-jail-${Date.now()}-${Math.random().toString(36).slice(2)}`;

		const userColor = color || '#FF4500';
		const msg = {
			type: messageType,
			id: msgId,
			nonce: msgId,
			channel: `#${channelLogin}`,
			roomID: channelID,
			roomLogin: channelLogin,
			timestamp: Date.now(),
			// `message`/`messageBody` feed FFZ's tokenizer; `messageParts` is
			// what Twitch's own ChatLine renderer iterates over — omitting it
			// makes Twitch's renderContent crash on `.some()` of undefined.
			message: text,
			messageBody: text,
			messageParts: [{type: 0, content: text}],
			user: {
				// Real Twitch id so RTE custom badge + paint resolve for this user.
				userID: twitchId || '0',
				userLogin: login || 'rte',
				userDisplayName: displayName || login || 'rte',
				color: userColor,
				chatColor: userColor,
				userType: '',
				isIntl: false
			},
			badges: {},
			deleted: false,
			isHistorical: false
		};

		try {
			const buffer = siteChat.ChatBuffer?.first;
			if (buffer?.handleMessage)
				buffer.handleMessage(msg);
			else
				service.addMessage(msg);
			return true;
		} catch (e) {
			this.log.warn('Failed to push relayed jail message', e);
			return false;
		}
	}
}
