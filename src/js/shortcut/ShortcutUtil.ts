import type { ShortcutOptionObjectImpl } from "../interface/ShortcutOptionObjectImpl";

/**
 * @description グローバルショートカットのマップデータ
 *              Map data for global shortcuts
 *
 * @type {Map}
 * @private
 */
const $globalShortcut: Map<string, Function> = new Map();

/**
 * @description グローバルで利用可能なショートカットコマンドを登録
 *              Register globally available shortcut commands
 *
 * @param   {string} code
 * @param   {Function} callback
 * @returns {void}
 * @method
 * @public
 */
export const $setGlobalShortcut = (code: string, callback: Function): void =>
{
    $globalShortcut.set(code, callback);
};

/**
 * @description グローバルショートカットのコマンドマップを返却
 *              Return global shortcut command map
 *
 * @returns {Map}
 * @method
 * @public
 */
export const $getGlobalShortcut = (): Map<string, Function> =>
{
    return $globalShortcut;
};

/**
 * @description タイムラインのショートカットマッピング
 *              Timeline Shortcut Mapping
 *
 * @type {Map}
 * @private
 */
const $timelineShortcut: Map<string, Function> = new Map();;

/**
 * @description タイムラインで利用可能なショートカットコマンドを登録
 *              Register shortcut commands available on the timeline
 *
 * @param   {string} code
 * @param   {Function} callback
 * @returns {void}
 * @method
 * @public
 */
export const $setTimelineShortcut = (code: string, callback: Function): void =>
{
    $timelineShortcut.set(code, callback);
};

/**
 * @description アクティブなエリアのショートカット
 *              Map data for global shortcuts
 *
 * @type {Map}
 * @private
 */
const $areaShortcut: Map<string, Function> | null = null;

/**
 * @description
 *
 * @return {Map | null}
 * @method
 * @public
 */
export const $getAreaShortcut = (): Map<string, Function> | null =>
{
    return $areaShortcut;
};

/**
 * @description ショートカットキーとオプションコマンドを連結してstringで返却する
 *              concatenate shortcut keys and option commands and return them as a string
 *
 * @param   {string} key
 * @param   {object} [option = null]
 * @returns {string}
 * @method
 * @public
 */
export const $generateShortcutKey = (
    key: string,
    option: ShortcutOptionObjectImpl | null = null
): string => {

    let value: string = key.length === 1 ? key.toLowerCase() : key;
    if (option) {
        if (option.shift) {
            value += "Shift";
        }
        if (option.alt) {
            value += "Alt";
        }
        if (option.ctrl) {
            value += "Ctrl";
        }
    }
    return value;
};

/**
 * @description キーボード入力中の判定フラグ
 *              Decision flag during keyboard input
 *
 * @private
 */
let $keyLock: boolean = false;

/**
 * @description キーボードの利用フラグを更新
 *              Update keyboard usage flag
 *
 * @return {void}
 * @method
 * @public
 */
export const $updateKeyLock = (lock: boolean): void =>
{
    $keyLock = lock;
};

/**
 * @description キーボードの利用状態を返却
 *              Return keyboard usage status
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $useKeyboard = (): boolean =>
{
    return $keyLock;
};