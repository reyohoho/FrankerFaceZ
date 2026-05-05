<template lang="html">
	<div class="ffz--home tw-flex tw-flex-nowrap">
		<div class="tw-flex-grow-1">
			<div
				v-if="showMigrationNotice"
				class="ffz--rte-migration-notice tw-pd-1 tw-mg-b-1 tw-border-radius-medium tw-c-background-alt-2"
			>
				<div class="tw-flex tw-align-items-start tw-mg-b-05">
					<figure class="ffz-i-attention ffz-font-size-3 tw-mg-r-05" />
					<h3 class="ffz-font-size-3 tw-flex-grow-1">
						{{ t('home.rte.migration.title', 'Расширение переехало на FrankerFaceZ') }}
					</h3>
				</div>
				<p class="tw-mg-b-05">
					{{ t('home.rte.migration.message', 'ReYohoho Twitch Extension теперь работает на основе FrankerFaceZ. Из-за лицензионных проблем с BetterTTV пришлось переехать на новую платформу.') }}
				</p>
				<p class="tw-mg-b-05">
					{{ t('home.rte.migration.settings', 'Почти все настройки, которые были в оригинальном RTE, доступны и в этой версии, но некоторые из них придётся настроить заново.') }}
				</p>
				<div class="tw-flex tw-justify-content-end tw-mg-t-1">
					<button class="tw-button tw-button--primary" @click="dismissMigrationNotice">
						<span class="tw-button__text">{{ t('home.rte.migration.dismiss', 'Понятно, больше не показывать') }}</span>
					</button>
				</div>
			</div>

			<div class="tw-align-center">
				<h2 class="ffz-i-zreknarf ffz-i-pd-1 ffz-font-size-2">
					FrankerFaceZ
				</h2>
				<span class="tw-c-text-alt">
					{{ t('home.tag-line', 'The Twitch Enhancement Suite') }}
				</span>
			</div>

			<section class="tw-pd-t-1 tw-border-t tw-mg-t-1">
				<markdown :source="t('home.about', md)" />
			</section>

			<section class="ffz--rte-info tw-pd-t-1 tw-border-t tw-mg-t-1">
				<h3 class="tw-pd-b-05 ffz-font-size-3">
					{{ t('home.rte.title', 'ReYohoho Twitch Extension') }}
				</h3>

				<div class="ffz--rte-subscription tw-pd-1 tw-c-background-base tw-border-radius-medium tw-mg-b-1">
					<h4 class="tw-pd-b-05 ffz-font-size-4">
						{{ t('home.rte.sub.title', 'Подписка RTE') }}
					</h4>

					<div v-if="rteSubState === 'loading'" class="tw-c-text-alt-2">
						{{ t('home.rte.sub.loading', 'Проверка статуса подписки…') }}
					</div>

					<div v-else-if="rteSubState === 'no-user'" class="tw-c-text-alt-2">
						{{ t('home.rte.sub.notLogged', 'Войдите в Twitch, чтобы увидеть статус подписки.') }}
					</div>

					<div v-else-if="rteSubState === 'error'" class="tw-c-text-alt-2">
						<p>{{ t('home.rte.sub.error', '⚠️ Не удалось получить статус подписки.') }}</p>
						<button class="tw-mg-t-05 tw-button" @click="fetchRteSubscription(true)">
							<span class="tw-button__text">{{ t('home.rte.sub.retry', 'Попробовать снова') }}</span>
						</button>
					</div>

					<div v-else-if="rteSubState === 'active'">
						<div class="tw-flex tw-align-items-center tw-mg-b-05" style="gap: 0.5rem;">
							<span class="tw-pill tw-pill--brand">
								{{ t('home.rte.sub.tier', 'Tier {tier}', { tier: rteSubData.tier }) }}
							</span>
							<span class="tw-c-text-success tw-semibold">
								{{ t('home.rte.sub.active', 'Активна') }}
							</span>
						</div>
						<p v-if="rteSubData.current_period_end" class="tw-c-text-alt">
							<strong>{{ t('home.rte.sub.until', 'Действительна до:') }}</strong>
							{{ formatRteDate(rteSubData.current_period_end) }}
						</p>
						<p v-if="rteUserId" class="tw-c-text-alt">
							<strong>Twitch ID:</strong> {{ rteUserId }}
						</p>
						<div class="tw-flex tw-mg-t-1 tw-flex-wrap" style="gap: 0.5rem;">
							<button class="tw-button" @click="fetchRteSubscription(true)">
								<span class="tw-button__text">{{ t('home.rte.sub.refresh', 'Обновить статус') }}</span>
							</button>
							<a
								class="tw-button tw-button--text"
								href="https://ext.rte.net.ru"
								target="_blank"
								rel="noopener noreferrer"
							>
								<span class="tw-button__text">{{ t('home.rte.sub.manage', 'Управление подпиской') }}</span>
							</a>
						</div>
					</div>

					<div v-else>
						<p class="tw-mg-b-05">
							🔒 {{ t('home.rte.sub.none', 'У вас нет активной подписки.') }}
						</p>
						<p class="tw-c-text-alt tw-mg-b-05">
							{{ t('home.rte.sub.cta', 'Оформите подписку, чтобы получить доступ к расширенным возможностям и поддержать разработку.') }}
						</p>
						<ul class="tw-mg-l-2 tw-c-text-alt">
							<li>{{ t('home.rte.sub.benefits.paint', 'Раскраска ника в чате (видна другим пользователям расширения).') }}</li>
							<li>{{ t('home.rte.sub.benefits.badge', 'Кастомный бейдж в чате (видна другим пользователям расширения).') }}</li>
						</ul>
						<p v-if="rteUserId" class="tw-c-text-alt tw-mg-t-05">
							<strong>{{ t('home.rte.sub.yourId', 'Ваш Twitch ID:') }}</strong>
							{{ rteUserId }}
						</p>
						<div class="tw-flex tw-mg-t-1 tw-flex-wrap" style="gap: 0.5rem;">
							<a
								class="tw-button tw-button--primary"
								href="https://ext.rte.net.ru"
								target="_blank"
								rel="noopener noreferrer"
							>
								<span class="tw-button__text">{{ t('home.rte.sub.subscribe', 'Оформить подписку') }}</span>
							</a>
							<button class="tw-button tw-button--text" @click="fetchRteSubscription(true)">
								<span class="tw-button__text">{{ t('home.rte.sub.check', 'Проверить статус') }}</span>
							</button>
						</div>
					</div>
				</div>

				<div class="ffz--rte-links tw-pd-1 tw-c-background-base tw-border-radius-medium">
					<h4 class="tw-pd-b-05 ffz-font-size-4">
						{{ t('home.rte.links.title', 'Полезные ссылки') }}
					</h4>
					<ul class="ffz--rte-links__list">
						<li>
							<a href="https://ext.rte.net.ru" target="_blank" rel="noopener noreferrer">
								🌐 {{ t('home.rte.links.website', 'Сайт расширения') }}
							</a>
							<span class="tw-c-text-alt-2 tw-mg-l-05">https://ext.rte.net.ru</span>
						</li>
						<li>
							<a href="https://t.me/reyohoho_twitch_ext" target="_blank" rel="noopener noreferrer">
								✈️ {{ t('home.rte.links.telegram', 'Новости и обновления в Telegram') }}
							</a>
							<span class="tw-c-text-alt-2 tw-mg-l-05">https://t.me/reyohoho_twitch_ext</span>
						</li>
						<li class="ffz--rte-links__group">
							<span class="tw-semibold">
								🐙 {{ t('home.rte.links.github', 'GitHub') }}
							</span>
							<ul class="ffz--rte-links__list ffz--rte-links__list--nested">
								<li v-for="repo in rteGithubRepos" :key="repo.url">
									<a :href="repo.url" target="_blank" rel="noopener noreferrer">{{ repo.label }}</a>
									<span class="tw-c-text-alt-2 tw-mg-l-05">{{ repo.url }}</span>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</section>

			<div
				v-if="unseen"
				class="tw-pd-t-1 tw-border-t tw-mg-t-1"
			>
				<h3 class="tw-pd-b-05 ffz-font-size-3">
					{{ t('home.new-settings', 'New Settings') }}
				</h3>

				<div class="tw-pd-b-1">
					{{ t('home.new-settings.desc', 'These are settings that you haven\'t looked at yet.') }}
				</div>

				<div
					v-for="cat of unseen"
					:key="cat.key"
					class="tw-mg-b-05"
				>
					<a
						class="tw-strong"
						href="#"
						@click.prevent="item.requestPage(cat.key)"
					>
						<span
							v-for="(tk,idx) of cat.tokens"
							:key="idx"
						>
							{{ tk.i18n ? t(tk.i18n, tk.title) : tk.title }}
						</span>
					</a>
					<div
						v-for="entry of cat.entries"
						:key="entry.key"
						class="tw-mg-l-2"
					>
						{{ entry.i18n ? t(entry.i18n, entry.title) : entry.title }}
					</div>
				</div>
			</div>

			<div
				v-if="addons"
				class="tw-pd-t-1 tw-border-t tw-mg-t-1"
			>
				<h3 class="tw-pd-b-05 ffz-font-size-3">
					{{ t('home.addon-updates', 'Updated Add-Ons') }}
				</h3>

				<div class="tw-pd-b-1">
					<markdown :source="t('home.addon-updates.desc', 'These add-ons have updated within the past seven days. Check the [changelog](~add_ons.changelog) to see what\'s changed.')" />
				</div>

				<div
					v-for="addon of addons"
					:key="addon.key"
					class="tw-mg-b-05 tw-flex tw-align-items-center"
				>
					<div class="ffz-card-img--size-4 tw-overflow-hidden tw-mg-r-1">
						<img :src="addon.icon" class="tw-image">
					</div>
					<div>
						<a
							v-if="addon.enabled && addon.settings"
							href="#"
							class="tw-strong ffz-link--inherit"
							@click.prevent="item.requestPage(addon.settings)"
						>
							{{ addon.name_i18n ? t(addon.name_i18n, addon.name) : addon.name }}
						</a>
						<div v-else class="tw-strong">
							{{ addon.name_i18n ? t(addon.name_i18n, addon.name) : addon.name }}
						</div>
						<div class="tw-c-text-alt">
							<span class="tw-mg-r-1">
								{{ t('addon.version', 'Version {version}', addon) }}
							</span>
							<span>
								{{ t('addon.updated', 'Updated: {when,humantime}', {when: addon.updated}) }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="new_addons"
				class="tw-pd-t-1 tw-border-t tw-mg-t-1"
			>
				<h3 class="tw-pd-b-05 ffz-font-size-3">
					{{ t('home.addon-new', 'New Add-Ons') }}
				</h3>

				<div class="tw-pd-b-1">
					<markdown :source="t('home.addon-new.desc', 'These add-ons were published within the past seven days. Check them out in [Add-Ons](~add_ons).')" />
				</div>

				<div
					v-for="addon of new_addons"
					:key="addon.key"
					class="tw-mg-b-05 tw-flex tw-align-items-center"
				>
					<div class="ffz-card-img--size-4 tw-overflow-hidden tw-mg-r-1">
						<img :src="addon.icon" class="tw-image">
					</div>
					<div>
						<a
							v-if="addon.enabled && addon.settings"
							href="#"
							class="tw-strong ffz-link--inherit"
							@click.prevent="item.requestPage(addon.settings)"
						>
							{{ addon.name_i18n ? t(addon.name_i18n, addon.name) : addon.name }}
						</a>
						<div v-else class="tw-strong">
							{{ addon.name_i18n ? t(addon.name_i18n, addon.name) : addon.name }}
						</div>
						<div class="tw-c-text-alt">
							<span class="tw-mg-r-1">
								{{ t('addon.version', 'Version {version}', addon) }}
							</span>
							<span>
								{{ t('addon.updated', 'Updated: {when,humantime}', {when: addon.updated}) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tw-mg-l-1 tw-flex-shrink-0 tweet-column">
			<div class="tw-flex tw-mg-b-1">
				<a
					:data-title="t('home.website', 'FrankerFaceZ Website')"
					class="tw-flex-grow-1 tw-button ffz-tooltip ffz--ffz-button tw-mg-r-1"
					href="https://www.frankerfacez.com/"
					target="_blank"
					rel="noopener"
				>
					<span class="tw-button__icon tw-pd-05">
						<figure class="ffz-i-zreknarf ffz-font-size-3" />
					</span>
				</a>
				<a
					:data-title="t('home.discord', 'Discord')"
					class="tw-flex-grow-1 tw-button ffz-tooltip ffz--discord-button tw-mg-r-1"
					href="https://discord.gg/UrAkGhT"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="tw-button__icon tw-pd-05-1">
						<figure class="ffz-i-discord ffz-font-size-3" />
					</span>
				</a>
				<!--a
					:data-title="t('home.twitter', 'Twitter')"
					class="tw-flex-grow-1 tw-button ffz-tooltip ffz--twitter-button tw-mg-r-1"
					href="https://twitter.com/frankerfacez"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="tw-button__icon tw-pd-05">
						<figure class="ffz-i-twitter ffz-font-size-3" />
					</span>
				</a-->
				<a
					:data-title="t('home.github', 'GitHub')"
					class="tw-flex-grow-1 tw-button ffz-tooltip ffz--github-button"
					href="https://github.com/FrankerFaceZ/FrankerFaceZ"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="tw-button__icon tw-pd-05">
						<figure class="ffz-i-github ffz-font-size-3" />
					</span>
				</a>
			</div>

			<rich-feed
				url="https://bsky-feed.special.frankerfacez.com/user::frankerfacez.com"
				:context="context"
			/>

			<!--template v-if="not_extension">
				<a
					:data-theme="theme"
					class="twitter-timeline"
					data-width="300"
					href="https://twitter.com/FrankerFaceZ?ref_src=twsrc%5Etfw"
				>
					{{ t('home.tweets', 'Tweets by FrankerFaceZ') }}
				</a>
			</template-->
		</div>
	</div>
</template>


<script>

import HOME_MD from '../home.md';

import {createElement as e} from 'utilities/dom';
import { EXTENSION } from 'utilities/constants';

const RTE_GITHUB_REPOS = [
	{label: 'FFZ-Extension (build scripts)', url: 'https://github.com/reyohoho/FFZ-Extension'},
	{label: 'FFZ-Add-Ons', url: 'https://github.com/reyohoho/FFZ-Add-Ons'},
	{label: 'FrankerFaceZ (client)', url: 'https://github.com/reyohoho/FrankerFaceZ'}
];

const RTE_PROXY_FALLBACK = 'https://ext.rte.net.ru:8443';

const RTE_MIGRATION_NOTICE_KEY = 'rte-migration-notice-seen';

export default {
	props: ['item', 'context'],

	data() {
		return {
			md: HOME_MD,
			theme: '',
			addons: null,
			new_addons: null,
			unseen: this.item.getUnseen(),
			//not_extension: ! EXTENSION

			rteSubState: 'loading',
			rteSubData: {},
			rteUserId: null,
			rteGithubRepos: RTE_GITHUB_REPOS,

			showMigrationNotice: false
		}
	},

	created() {
		this.updateAddons();
		this.updateTheme();
		this.context.context.on('changed:theme.is-dark', this.updateTheme, this);

		const ffz = this.context.getFFZ();
		ffz.on('main_menu:update-unseen', this.updateUnseen, this);
		ffz.on('addons:data-loaded', this.updateAddons, this);

		this.checkMigrationNotice();

		this.fetchRteSubscription(true);
	},

	beforeDestroy() {
		this.context.context.off('changed:theme.is-dark', this.updateTheme, this);

		const ffz = this.context.getFFZ();
		ffz.off('main_menu:update-unseen', this.updateUnseen, this);
		ffz.off('addons:data-loaded', this.updateAddons, this);
	},

	/*mounted() {
		let el;
		if ( this.not_extension )
			document.head.appendChild(el = e('script', {
				id: 'ffz--twitter-widget-script',
				async: true,
				charset: 'utf-8',
				src: 'https://platform.twitter.com/widgets.js',
				onLoad: () => el.remove()
			}));
	},*/

	methods: {
		updateUnseen() {
			this.unseen = this.item.getUnseen();
		},

		updateAddons() {
			const ffz = this.context.getFFZ(),
				addon_module = ffz.resolve('addons'),
				addons = addon_module?.addons;

			const out = [],
				new_out = [],
				week_ago = Date.now() - (86400 * 7 * 1000);

			if ( addons )
				for(const [key, addon] of Object.entries(addons)) {
					const enabled = addon_module.isAddonEnabled(key),
						is_new = addon.created && addon.created >= week_ago,
						is_updated = enabled && addon.updated && addon.updated >= week_ago;

					if ( ! is_updated && ! (is_new && ! enabled && ! addon.unlisted) )
						continue;

					const copy = {
						key,
						enabled,
						icon: addon.icon,
						name: addon.name,
						name_i18n: addon.name_i18n,
						updated: addon.updated,
						settings: addon.settings,
						version: addon.version
					};

					if ( is_new )
						new_out.push(copy);

					if ( is_updated )
						out.push(copy);
				}

			out.sort((a,b) => b.updated - a.updated);
			new_out.sort((a,b) => b.created - a.created);

			this.addons = out.length ? out : null;
			this.new_addons = new_out.length ? new_out : null;
		},

		updateTheme() {
			this.theme = this.context.context.get('theme.is-dark') ? 'dark' : 'light'
		},

		checkMigrationNotice() {
			try {
				const ffz = this.context.getFFZ(),
					settings = ffz?.resolve?.('settings'),
					provider = settings?.provider;

				if ( ! provider ) {
					this.showMigrationNotice = true;
					return;
				}

				this.showMigrationNotice = ! provider.get(RTE_MIGRATION_NOTICE_KEY, false);
			} catch ( err ) {
				const ffz = this.context.getFFZ();
				ffz?.log?.warn?.('[home] failed to read migration notice flag:', err);
				this.showMigrationNotice = true;
			}
		},

		dismissMigrationNotice() {
			this.showMigrationNotice = false;

			try {
				const ffz = this.context.getFFZ(),
					settings = ffz?.resolve?.('settings'),
					provider = settings?.provider;

				provider?.set?.(RTE_MIGRATION_NOTICE_KEY, true);
			} catch ( err ) {
				const ffz = this.context.getFFZ();
				ffz?.log?.warn?.('[home] failed to persist migration notice flag:', err);
			}
		},

		formatRteDate(value) {
			if ( ! value )
				return '';
			try {
				return new Date(value).toLocaleDateString();
			} catch ( err ) {
				return String(value);
			}
		},

		getRteProxyBase() {
			const ffz = this.context.getFFZ(),
				proxy = ffz.resolve('addon.reyohoho-emotes-proxy');
			return proxy?._proxyBase || RTE_PROXY_FALLBACK;
		},

		async fetchRteSubscription(force = false) {
			if ( this.rteSubState === 'loading' && ! force )
				return;

			const ffz = this.context.getFFZ(),
				site = ffz.resolve('site'),
				user = site?.getUser?.();

			this.rteUserId = user?.id || null;

			if ( ! user?.id ) {
				this.rteSubState = 'no-user';
				this.rteSubData = {};
				return;
			}

			const proxyBase = this.getRteProxyBase();
			if ( ! proxyBase ) {
				this.rteSubState = 'error';
				this.rteSubData = {};
				return;
			}

			this.rteSubState = 'loading';
			this.rteSubData = {};

			try {
				const url = `${proxyBase}/api/subscription/check/${encodeURIComponent(user.id)}`,
					resp = await fetch(url);

				if ( ! resp.ok ) {
					this.rteSubState = 'error';
					return;
				}

				const data = await resp.json();
				this.rteSubData = data || {};

				if ( data?.error )
					this.rteSubState = 'error';
				else if ( data?.has_subscription )
					this.rteSubState = 'active';
				else
					this.rteSubState = 'inactive';
			} catch ( err ) {
				const ffz2 = this.context.getFFZ();
				ffz2?.log?.warn?.('[home] subscription check failed:', err);
				this.rteSubState = 'error';
				this.rteSubData = {};
			}
		}
	}
}
</script>
