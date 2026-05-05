'use strict';

/**
 * One-time first-run migration for the ReYohoho fork.
 *
 * Runs synchronously on `localStorage` BEFORE the FrankerFaceZ {@link SettingsManager}
 * starts up. Two responsibilities:
 *
 *  1. Migrate selected settings from the legacy ReYohoho extension's `rte_*`
 *     localStorage keys into the FFZ profile-0 settings, using the new
 *     {@link FFZ_LS_PREFIX} namespace.
 *  2. Apply our curated set of FFZ defaults (a subset of `ffz-settings (2026-5-5).json`).
 *
 * The migration runs only when {@link RTE_FIRST_RUN_FLAG} is missing in
 * localStorage. Existing values from the legacy extension take precedence over
 * our defaults so that link previews etc. respect the user's prior choices.
 */
import {
	FFZ_LS_PREFIX,
	RTE_FIRST_RUN_FLAG
} from './utilities/rte_storage_constants';

const PROFILE_PREFIX = 'p:0:';

const LEGACY_RTE_SETTINGS_KEY = 'rte_settings';
const LEGACY_RTE_MENTION_SOUND_KEY = 'reyohoho_wtv_mention_sound';

// ─── Curated FFZ defaults (extracted from ffz-settings (2026-5-5).json) ────────
//
// IMPORTANT: every key listed here is forced on first run. Subsequent loads
// are gated by RTE_FIRST_RUN_FLAG, so the user can edit any of these afterwards
// without us reverting them.
//
// Excluded vs the JSON dump on purpose:
//   * `unlocked-effects` — should be derived from the user's actual unlocks.
//   * `chat.filtering.highlight-basic-blocked` digit-only entries — these now
//      live behind the dedicated `chat.filtering.block-digit-only-messages`
//      toggle (default off).
//   * `cfg-seen` / `cfg-collapsed` — UI scaffolding, not real settings.
//   * Top-level `chat.actions.hover` (legacy non-profile copy) — only the
//      `p:0:chat.actions.hover` profile entry is written.

type DefaultEntry = {
	key: string;
	value: unknown;
	/** When true, store under the active LS prefix without the `p:0:` wrap. */
	global?: boolean;
};

const DEFAULTS: DefaultEntry[] = [
	// Rich content & link previews
	{ key: 'chat.rich.enabled', value: true },
	{ key: 'chat.rich.want-mid', value: false },
	{ key: 'chat.rich.hide-tokens', value: false },
	{ key: 'chat.rich.all-links', value: true },
	{ key: 'chat.rich.media-previews', value: true },
	{ key: 'chat.rich.media-previews-style', value: 'card' },

	// Mentions & filtering
	{ key: 'chat.filtering.highlight-mentions', value: true },
	{ key: 'chat.filtering.process-own', value: true },
	{ key: 'chat.filtering.clickable-mentions', value: true },
	{ key: 'chat.filtering.display-deleted', value: 'DETAILED' },

	// Tooltips
	{ key: 'tooltip.link-nsfw-images', value: true },

	// Hover actions (full export of pin / reply / copy / chat command / friends-follows)
	{
		key: 'chat.actions.hover',
		value: [
			{
				v: { action: 'pin', appearance: { type: 'icon', icon: 'ffz-i-pin' } },
				id: '1777973237749-0.4404148505118972-0'
			},
			{
				v: { action: 'reply', appearance: { type: 'dynamic' } },
				id: '1777973109311-0.5860335954089331-1'
			},
			{
				v: {
					action: 'copy_message',
					appearance: { type: 'icon', icon: 'ffz-i-docs' },
					options: { format: '{{message.text}}' },
					display: {},
					ctx: 'hover'
				},
				id: '1777096309292-0.9656660781511698-0'
			},
			{
				v: {
					action: 'chat',
					appearance: {
						type: 'icon',
						text: 'C',
						icon: 'ffz-i-docs',
						color: '#FF0000',
						tooltip: 'Скопировать и отправить'
					},
					ctx: 'hover',
					options: { command: '{{message.text}}' },
					display: {}
				},
				id: '1777097707347-0.42712167435926307-0'
			},
			{
				v: {
					action: 'addon.reyohoho-user-tools.follows',
					appearance: { type: 'icon', icon: 'ffz-i-link-ext' }
				},
				id: '1777973085674-0.7380558386528492-0'
			}
		]
	},
	{ key: 'chat.actions.hover-size', value: 20 },

	// 7TV unlisted emotes
	{ key: 'addon.seventv_emotes.unlisted_emotes', value: true },

	// FFZ-AP highlight sound
	{ key: 'ffzap.core.enable_highlight_sound', value: true },
	{ key: 'ffzap.core.highlight_sound_prevent_own_channel', value: true },

	// Channel points & drops
	{ key: 'chat.points.auto-rewards', value: true },
	{ key: 'chat.drops.auto-rewards', value: true },

	// Layout / channel / metadata
	{ key: 'channel.hide-unfollow', value: false },
	{ key: 'channel.auto-click-chat', value: false },
	{ key: 'metadata.player-stats', value: true },
	{ key: 'metadata.stream-delay-warning', value: 10 },

	// Player
	{ key: 'chat.emotes.2x', value: 0 },
	{ key: 'player.disable-content-warnings', value: true },
	{ key: 'player.compressor.shortcut', value: 'alt+c' },

	// Inline tab completion (addon)
	{ key: 'addon.inlinetab.tip-count', value: true },

	// Top-level (no profile prefix)
	{
		key: 'addons.enabled',
		global: true,
		value: [
			'reyohoho-user-tools',
			'reyohoho-mod-slider',
			'reyohoho-friends',
			'reyohoho-emotes-proxy',
			'reyohoho-emote-actions',
			'reyohoho-chat-commands',
			'reyohoho-bypass-unique-chat',
			'reyohoho-ascii-art-font',
			'reyohoho-anon-chat',
			'ffzap-bttv',
			'7tv-emotes',
			'ffzap-core',
			'reyohoho-info',
			'inline-tab-completion'
		]
	},
	{ key: 'agreed-tos', global: true, value: ['YouTube'] }
];

// ─── Legacy RTE → FFZ mapping ──────────────────────────────────────────────────

const enum RteDeleted {
	DEFAULT = 0,
	SHOW = 1,
	HIDE = 2,
	HIGHLIGHT = 3
}

const enum RteKeywordType {
	MESSAGE = 0,
	WILDCARD = 1,
	EXACT = 2,
	USER = 3,
	BADGE = 4
}

type RteKeywordRecord = {
	keyword?: string;
	type?: RteKeywordType;
	color?: string;
	channels?: string[];
};

type FfzBasicTermEntry = {
	v: {
		v: string;
		t: 'text' | 'glob' | 'regex' | 'raw';
		c: string;
		s: boolean;
		h: boolean;
		w: boolean;
		p: number;
	};
	id: string;
};

function safeParse<T = unknown>(raw: string | null): T | null {
	if (raw == null)
		return null;

	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

function rteDeletedToFfz(value: unknown): unknown {
	switch (value) {
		case RteDeleted.SHOW:
			return 'LEGACY';
		case RteDeleted.HIDE:
			return 'BRIEF';
		case RteDeleted.HIGHLIGHT:
			return 'DETAILED';
		case RteDeleted.DEFAULT:
		default:
			return false;
	}
}

function makeId(seed: number): string {
	return `${Date.now()}-rte-migrate-${seed}`;
}

function buildBasicTerms(records: Record<string, RteKeywordRecord>): {
	terms: FfzBasicTermEntry[];
	users: FfzBasicTermEntry[];
	badges: FfzBasicTermEntry[];
} {
	const terms: FfzBasicTermEntry[] = [];
	const users: FfzBasicTermEntry[] = [];
	const badges: FfzBasicTermEntry[] = [];

	let seed = 0;
	for (const record of Object.values(records || {})) {
		if (!record || typeof record !== 'object')
			continue;

		const keyword = (record.keyword ?? '').trim();
		if (!keyword)
			continue;

		// The user explicitly chose to skip records with channel restrictions
		// (FFZ basic-terms have no channel scoping; importing globally would
		// surprise the user with "highlights everywhere").
		if (Array.isArray(record.channels) && record.channels.length > 0)
			continue;

		const color = typeof record.color === 'string' ? record.color : '';
		const id = makeId(seed++);

		switch (record.type) {
			case RteKeywordType.WILDCARD: {
				terms.push({
					v: { v: keyword, t: 'glob', c: color, s: false, h: false, w: false, p: 0 },
					id
				});
				break;
			}
			case RteKeywordType.MESSAGE:
			case RteKeywordType.EXACT:
			case undefined: {
				terms.push({
					v: { v: keyword, t: 'text', c: color, s: false, h: false, w: false, p: 0 },
					id
				});
				break;
			}
			case RteKeywordType.USER: {
				users.push({
					v: { v: keyword, t: 'text', c: color, s: false, h: false, w: false, p: 0 },
					id
				});
				break;
			}
			case RteKeywordType.BADGE: {
				badges.push({
					v: { v: keyword, t: 'text', c: color, s: false, h: false, w: false, p: 0 },
					id
				});
				break;
			}
			default:
				break;
		}
	}

	return { terms, users, badges };
}

type LegacyRteSettings = {
	linkPreview?: boolean;
	friendsEnabled?: boolean;
	chatSwipe?: boolean;
	deletedMessages?: number;
	highlightKeywords?: Record<string, RteKeywordRecord> | null;
	[key: string]: unknown;
};

function collectMigrations(): Map<string, unknown> {
	const out = new Map<string, unknown>();

	const legacy = safeParse<LegacyRteSettings>(localStorage.getItem(`rte_${LEGACY_RTE_SETTINGS_KEY}`))
		?? safeParse<LegacyRteSettings>(localStorage.getItem(LEGACY_RTE_SETTINGS_KEY));

	if (legacy) {
		if (typeof legacy.linkPreview === 'boolean') {
			// `linkPreview` historically gated *all* RTE link previews. Mirror it
			// onto both `chat.rich.media-previews` (direct media) and
			// `chat.rich.all-links` (rich embeds for arbitrary links) so a user
			// who turned previews off in RTE does not get them re-enabled by our
			// curated defaults.
			out.set('chat.rich.media-previews', legacy.linkPreview);
			out.set('chat.rich.all-links', legacy.linkPreview);
		}

		if (typeof legacy.friendsEnabled === 'boolean')
			out.set('addon.reyohoho-friends.enabled', legacy.friendsEnabled);

		if (typeof legacy.chatSwipe === 'boolean')
			out.set('addon.reyohoho-mod-slider.enabled', legacy.chatSwipe);

		if (typeof legacy.deletedMessages === 'number')
			out.set('chat.filtering.display-deleted', rteDeletedToFfz(legacy.deletedMessages));

		if (legacy.highlightKeywords && typeof legacy.highlightKeywords === 'object') {
			const { terms, users, badges } = buildBasicTerms(legacy.highlightKeywords);
			if (terms.length > 0)
				out.set('chat.filtering.highlight-basic-terms', terms);
			if (users.length > 0)
				out.set('chat.filtering.highlight-basic-users', users);
			if (badges.length > 0)
				out.set('chat.filtering.highlight-basic-badges', badges);

			if (terms.length || users.length || badges.length) {
				out.set('chat.filtering.highlight-tokens', true);
				out.set('chat.filtering.highlight-mentions', true);
			}
		}
	}

	const mentionSoundRaw = localStorage.getItem(LEGACY_RTE_MENTION_SOUND_KEY);
	if (mentionSoundRaw === 'true' || mentionSoundRaw === 'false')
		out.set('ffzap.core.enable_highlight_sound', mentionSoundRaw === 'true');

	return out;
}

function writeProfileValue(key: string, value: unknown, global = false) {
	const fullKey = `${FFZ_LS_PREFIX}${global ? '' : PROFILE_PREFIX}${key}`;
	try {
		localStorage.setItem(fullKey, JSON.stringify(value));
	} catch (err) {
		// LocalStorage may be unavailable / quota exceeded — fail loudly only
		// once at console.warn so we do not blow up startup.
		console.warn(`[RTE first-run] Failed to write ${fullKey}:`, err);
	}
}

/**
 * Run the one-time migration. Safe to call multiple times — it short-circuits
 * after the first successful execution.
 */
export function runRteFirstRunMigration(): void {
	try {
		if (localStorage.getItem(RTE_FIRST_RUN_FLAG) != null)
			return;
	} catch {
		// localStorage inaccessible — nothing to do.
		return;
	}

	const migrations = collectMigrations();

	// 1. Apply curated defaults (force_all per user decision).
	for (const entry of DEFAULTS) {
		// Migration values win over defaults for the same key.
		if (!entry.global && migrations.has(entry.key))
			continue;

		writeProfileValue(entry.key, entry.value, !!entry.global);
	}

	// 2. Apply migrations from legacy `rte_*` storage.
	for (const [key, value] of migrations)
		writeProfileValue(key, value, false);

	// 3. Mark complete.
	try {
		localStorage.setItem(RTE_FIRST_RUN_FLAG, JSON.stringify({
			at: new Date().toISOString(),
			version: 1
		}));
	} catch (err) {
		console.warn('[RTE first-run] Failed to set first-run flag:', err);
	}
}
