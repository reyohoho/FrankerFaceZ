'use strict';

// Same hotlink‑sensitive hosts as `reyohoho-twitch-extension/src/utils/link_preview.js`
// (+ kappa.lol, which RTE always wraps when a CDN mirror is configured;
// + i.imgur.com — direct CDN URLs with query params / webp often break as hotlinks in embeds).
const NEED_PROXY_HOSTS = /(?:cdn\.discordapp\.com|media\.discordapp\.net|images-ext-\d+\.discordapp\.net|i\.ytimg\.com|i\.ibb\.co|cdn\.7tv\.app|kappa\.lol|i\.imgur\.com)/i;

const ALREADY_RTE_MIRROR = /\.rte\.net\.ru/i;

const RTE_IMAGE_CDN_BASE = 'http://cdn.rte.net.ru/';

/**
 * Rewrite image `src` to load via the public RTE CDN mirror (`http://cdn.rte.net.ru/<originalUrl>`).
 * Mirrors ReYohoho behaviour: prepend the proxy base so the path is `/https://…` or `/http://…`.
 *
 * @param {string|null|undefined} url
 * @returns {string|null|undefined}
 */
export function applyRteImageCdnProxy(url) {
	if (typeof url !== 'string' || ! url.length )
		return url;
	if (ALREADY_RTE_MIRROR.test(url))
		return url;
	if ( ! NEED_PROXY_HOSTS.test(url) )
		return url;

	return RTE_IMAGE_CDN_BASE + url;
}
