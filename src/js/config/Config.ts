/**
 * @description Prefix用の固定値
 *              Fixed value for Prefix
 *
 * @type {string}
 * @constant
 */
export const $PREFIX: string = "__next2d-tools__";

/**
 * @description ユーザー個別データ保存のキー
 *              Key for saving individual user data
 *
 * @type {string}
 * @constant
 */
export const $USER_SETTING_KEY: string = `${$PREFIX}@user-setting`;

/**
 * @description 言語設定の保存キー
 *              Key to save language settings
 *
 * @type {string}
 * @constant
 */
export const $USER_LANGUAGE_SETTING_KEY: string = `${$PREFIX}@language-setting`;

/**
 * @description ショートカットの保存キー
 *              Key to save shortcut settings
 *
 * @type {string}
 * @constant
 */
export const $USER_SHORTCUT_SETTING_KEY: string = `${$PREFIX}@shortcut`;

/**
 * @description ツールエリアの移動状態の保存キー
 *              Key to save tool area movement status
 *
 * @type {string}
 * @constant
 */
export const $USER_TOOL_AREA_STATE_KEY: string = `${$PREFIX}@tool-area`;

/**
 * @description IndexedDBのデータベース名
 *              IndexedDB database name
 *
 * @type {string}
 * @constant
 */
export const $USER_DATABASE_NAME: string = "save-data";

/**
 * @description IndexedDBのストア名
 *              IndexedDB store name
 *
 * @type {string}
 * @constant
 */
export const $USER_DATABASE_STORE_KEY: string = "local";