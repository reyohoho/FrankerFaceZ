'use strict';

// Same hotlink‑sensitive hosts as `reyohoho-twitch-extension/src/utils/link_preview.js`
// (+ kappa.lol, which RTE always wraps when a CDN mirror is configured;
// + i.imgur.com — direct CDN URLs with query params / webp often break as hotlinks in embeds).
const NEED_PROXY_HOSTS = /(?:cdn\.discordapp\.com|media\.discordapp\.net|images-ext-\d+\.discordapp\.net|img\.youtube\.com|i\d*\.ytimg\.com|i\.ibb\.co|cdn\.7tv\.app|kappa\.lol|i\.imgur\.com)/i;

const ALREADY_RTE_MIRROR = /\.rte\.net\.ru/i;

const RTE_IMAGE_CDN_BASE = 'http://cdn.rte.net.ru/';

/**
 * Global tooltips (`tooltip.images`) must still be enabled; combined with this,
 * controls images in chat link cards, link hover previews, and direct media previews.
 *
 * @param {{get: (key: string) => unknown}} ctx
 */
export function linkPreviewAllowsMedia(ctx) {
	try {
		return !!(ctx?.get?.('tooltip.images') && ctx.get('chat.rich.media-previews'));
	} catch {
		return false;
	}
}

/**
 * Walk resolver token trees (`short` / `mid` / `full`) and RTE-proxy image `url` fields.
 * Mutates nested objects in place (run on your own clone if needed).
 *
 * @param {unknown} node
 */
export function applyRteImageUrlsDeep(node) {
	if (node == null )
		return;
	if ( Array.isArray(node) ) {
		for (let i = 0, l = node.length; i < l; i++)
			applyRteImageUrlsDeep(node[i]);

		return;
	}
	if ( typeof node !== 'object' )
		return;

	const rec = /** @type {Record<string, unknown>} */ (node);
	if (rec.type === 'image' && typeof rec.url === 'string' )
		rec.url = applyRteImageCdnProxy(rec.url);

	for (const k of Object.keys(rec))
		if (hasOwn(rec, k) )
			applyRteImageUrlsDeep(rec[k]);
}

function hasOwn(obj, k) {
	return Object.prototype.hasOwnProperty.call(obj, k);
}

/**
 * First embedded image URL from link-resolver payloads (cards / tooltips).
 *
 * @param {Record<string, unknown>|null|undefined} data
 * @returns {string|null}
 */
export function extractFirstCardImageUrl(data) {
	if ( ! data || typeof data !== 'object' )
		return null;

	for (const key of /** @type {const} */ ([ 'short', 'mid', 'full' ])) {
		if (hasOwn(data, key) ) {
			const found = findFirstImageUrl(/** @type {unknown} */ (data[key]) );
			if (found)
				return found;
		}
	}

	return null;
}

/** @returns {string|null} */
function findFirstImageUrl(node) {
	if (node == null )
		return null;
	if ( Array.isArray(node) ) {
		for (let i = 0, l = node.length; i < l; i++) {
			const inner = findFirstImageUrl(node[i]);
			if (inner)
				return inner;
		}

		return null;
	}
	if ( typeof node !== 'object' )
		return null;

	const rec = /** @type {Record<string, unknown>} */ (node);
	if (rec.type === 'image' && typeof rec.url === 'string' )
		return rec.url;

	for (const k of Object.keys(rec))
		if (hasOwn(rec, k) ) {
			const inner = findFirstImageUrl(rec[k]);
			if (inner)
				return inner;
		}

	return null;
}

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
