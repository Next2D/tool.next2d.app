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
 * @description ショートカットキーとオプションコマンドを連結してstringで返却する
 *              ショートカットキーとオプションコマンドを連結してstringで返却する
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