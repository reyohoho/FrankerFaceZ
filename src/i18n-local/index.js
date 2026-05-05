'use strict';

// ============================================================================
// Local Locale Registry
// ----------------------------------------------------------------------------
// FFZ pulls translations from cdn2.frankerfacez.com. We cannot publish
// ReYohoho/RTE addon strings there, so we ship a few small dictionaries with
// the build and merge them on top of the CDN payload (see `loadLocale` in
// `client/src/i18n.js`).
//
// To add another language: drop a new module under this directory exporting a
// flat `{key: value}` map and register it below under every locale-id alias
// you want to cover (the i18n manager normalizes ids to lower case before
// looking them up here).
// ============================================================================

import ruRU from './ru-RU';

const RU_ALIASES = ['ru', 'ru-ru'];

const REGISTRY = {};

for (const id of RU_ALIASES)
	REGISTRY[id] = ruRU;

export default REGISTRY;

export function getLocalLocale(locale) {
	if (typeof locale !== 'string')
		return null;
	return REGISTRY[locale.toLowerCase()] || null;
}
