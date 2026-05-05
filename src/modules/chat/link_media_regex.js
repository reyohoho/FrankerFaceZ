'use strict';

// Shared URL patterns for inline / card media link handling. **Must not** live
// in `link_providers.js` — that module is re-exported as `import * as LINK_PROVIDERS`,
// and stray `export const` values there get registered as bogus link providers.

export const DIRECT_IMAGE_URL = /^https?:\/\/[a-zA-Z0-9./\-_%@?&=:+~]+\.(?:jpg|jpeg|png|gif|bmp|webp|jfif|avif)(?:\?[^#]*)?(?:#.*)?$/i;
export const DIRECT_VIDEO_URL = /^https?:\/\/[a-zA-Z0-9./\-_%@?&=:+~]+\.(?:mp4|mov|webm)(?:\?[^#]*)?(?:#.*)?$/i;
export const SEVENTV_EMOTE_URL = /^https?:\/\/7tv\.app\/emotes\/([a-zA-Z0-9]+)/i;
export const IMGUR_URL = /^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/i;
export const KAPPA_LOL_URL = /^https?:\/\/(?:[a-zA-Z0-9]+\.)?kappa\.lol\/([a-zA-Z0-9]+)/i;
