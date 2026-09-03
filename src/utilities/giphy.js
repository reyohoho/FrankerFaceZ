'use strict';

// Helpers for Twitch native GIF messages (Giphy integration for Tier 2+ subscribers).
//
// Twitch attaches a giphy media URL to these messages, e.g.
//   https://media3.giphy.com/media/KCdWBZwz6M2Yvm3rHh/giphy.gif?cid=...&ep=...&rid=giphy.gif&ct=g
// Such long URLs won't work with our link-preview engine when a user copies /
// re-sends them, so we normalize them to a short direct image link:
//   https://i.giphy.com/KCdWBZwz6M2Yvm3rHh.webp

const GIPHY_HOSTNAME_REGEX = /(^|\.)giphy\.com$/i;
const GIPHY_ID_REGEX = /^[a-zA-Z0-9]+$/;

function stripExtension(segment) {
	if ( typeof segment !== 'string' )
		return '';
	const dotIndex = segment.indexOf('.');
	return dotIndex === -1 ? segment : segment.slice(0, dotIndex);
}

/**
 * Extracts the Giphy media id from any known giphy URL format:
 *  - https://media3.giphy.com/media/{id}/giphy.gif?...
 *  - https://media.giphy.com/media/v1.Y2lk.../{id}/giphy.gif
 *  - https://i.giphy.com/media/{id}/giphy.webp
 *  - https://i.giphy.com/{id}.webp
 *  - https://giphy.com/gifs/some-slug-{id}
 *  - https://giphy.com/embed/{id}
 *
 * @param {string} url
 * @returns {string|null}
 */
export function getGiphyIdFromUrl(url) {
	if ( typeof url !== 'string' || url.length === 0 )
		return null;

	let parsed;
	try {
		parsed = new URL(url.replace(/&amp;/g, '&'));
	} catch(_) {
		return null;
	}

	if ( ! GIPHY_HOSTNAME_REGEX.test(parsed.hostname) )
		return null;

	const segments = parsed.pathname.split('/').filter(Boolean);
	if ( segments.length === 0 )
		return null;

	const mediaIndex = segments.indexOf('media');
	if ( mediaIndex !== -1 ) {
		// /media/{id}/giphy.gif  or  /media/v1.<token>/{id}/giphy.gif
		const rest = segments.slice(mediaIndex + 1);
		const idSegment = rest.find(segment => GIPHY_ID_REGEX.test(segment));
		if ( idSegment )
			return idSegment;
		// /media/{id}.gif
		const withExt = rest.find(segment => GIPHY_ID_REGEX.test(stripExtension(segment)));
		if ( withExt )
			return stripExtension(withExt);
		return null;
	}

	const gifsIndex = segments.indexOf('gifs');
	if ( gifsIndex !== -1 && segments[gifsIndex + 1] ) {
		// /gifs/some-slug-{id}  or  /gifs/{id}
		const slug = segments[gifsIndex + 1];
		const lastDash = slug.lastIndexOf('-');
		const candidate = lastDash === -1 ? slug : slug.slice(lastDash + 1);
		return GIPHY_ID_REGEX.test(candidate) ? candidate : null;
	}

	const embedIndex = segments.indexOf('embed');
	if ( embedIndex !== -1 && segments[embedIndex + 1] ) {
		const candidate = stripExtension(segments[embedIndex + 1]);
		return GIPHY_ID_REGEX.test(candidate) ? candidate : null;
	}

	// https://i.giphy.com/{id}.webp
	const candidate = stripExtension(segments[segments.length - 1]);
	return GIPHY_ID_REGEX.test(candidate) ? candidate : null;
}

/**
 * Converts any giphy URL to a short direct image link
 * (https://i.giphy.com/{id}.webp). Returns null if the URL is not a giphy URL
 * or the id can't be extracted.
 *
 * @param {string} url
 * @returns {string|null}
 */
export function getGiphyDirectUrl(url) {
	const id = getGiphyIdFromUrl(url);
	if ( ! id )
		return null;
	return `https://i.giphy.com/${id}.webp`;
}
