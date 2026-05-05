'use strict';

/**
 * Storage namespace constants for the ReYohoho fork of FrankerFaceZ.
 *
 * Original FFZ uses `FFZ:setting:` (localStorage), `FFZ` (IndexedDB) and the
 * `ffz-settings` BroadcastChannel. To avoid collisions when both extensions
 * are installed simultaneously on the same domain, we namespace everything
 * to `RTE-FFZ`.
 */
export const FFZ_LS_PREFIX = 'RTE-FFZ:setting:';
export const FFZ_IDB_NAME = 'RTE-FFZ';
export const FFZ_BC_NAME = 'rte-ffz-settings';
export const FFZ_BRIDGE_FRAME_ID = 'rte-ffz-settings-bridge';

/** Marker that indicates the one-time first-run migration has completed. */
export const RTE_FIRST_RUN_FLAG = 'RTE-FFZ:first-run-v1';
