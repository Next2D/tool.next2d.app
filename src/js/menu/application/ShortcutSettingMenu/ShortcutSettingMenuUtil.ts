import type { ShortcutKeyStringImpl } from "@/interface/ShortcutKeyStringImpl";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import type { ShortcutKeyOptionObjectImpl } from "@/interface/ShortcutKeyOptionObjectImpl";

/**
 * @description ショートカットリストで選択されたElement
 *              Element selected in the shortcut list
 *
 * @type {HTMLElement | null}
 * @default null
 * @private
 */
let $selectElement: HTMLElement | null = null;

/**
 * @description ショートカットリストで選択されたElementを返却、初期値はnull
 *              Returns the Element selected in the shortcut list, default value null
 *
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const $getSelectElement = (): HTMLElement | null =>
{
    return $selectElement;
};

/**
 * @description ショートカットリストで選択したElementをセット、初期値に戻す場合はnullをセット
 *              Set the Element selected in the shortcut list, or null to return to the initial value.
 *
 * @params {HTMLElement | null}
 * @return {void}
 * @method
 * @public
 */
export const $setSelectElement = (element: HTMLElement | null): void =>
{
    $selectElement = element;
};

/**
 * @description 個別のショートカットコマンドと既存のコマンドのマッピングデータ
 *              Mapping data between individual shortcut commands and existing commands
 *
 * @type {Map}
 * @private
 */
const $commandMapping: Map<ShortcutKeyStringImpl, Map<string, string>> = new Map([
    ["screen",   new Map()],
    ["timeline", new Map()],
    ["library",  new Map()],
    ["global",   new Map()]
]);

/**
 * @description 個別のショートカットコマンドと既存のコマンドのマッピングデータを初期化
 *              Initialize mapping data between individual shortcut commands and existing commands
 *
 * @return {Map}
 * @method
 * @public
 */
export const $clearCommandMapping = (): void =>
{
    $commandMapping.get("global")?.clear();
    $commandMapping.get("library")?.clear();
    $commandMapping.get("screen")?.clear();
    $commandMapping.get("timeline")?.clear();
};

/**
 * @description 個別のショートカットコマンドと既存のコマンドのマッピングデータを返却
 *              Return mapping data between individual shortcut commands and existing commands
 *
 * @return {Map}
 * @method
 * @public
 */
export const $getCommandMapping = (): Map<ShortcutKeyStringImpl, Map<string, string>> =>
{
    return $commandMapping;
};

/**
 * @description 個別のショートカットの設定の一時保存データ
 *              Temporarily saved data for individual shortcut settings
 *
 * @type {Map}
 * @private
 */
const $tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = new Map([
    ["screen",   new Map()],
    ["timeline", new Map()],
    ["library",  new Map()],
    ["global",   new Map()]
]);

/**
 * @description 個別のショートカットの設定の一時保存データを返却
 *              Return temporarily saved data of individual shortcut settings
 *
 * @return {Map}
 * @method
 * @public
 */
export const $getTempMapping = (): Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> =>
{
    return $tempMapping;
};

/**
 * @description 個別のショートカットの設定の一時保存データを初期化
 *              Initialize temporarily saved data of individual shortcut settings
 *
 * @return {void}
 * @method
 * @public
 */
export const $clearTempMapping = (): void =>
{
    $tempMapping.get("global")?.clear();
    $tempMapping.get("library")?.clear();
    $tempMapping.get("screen")?.clear();
    $tempMapping.get("timeline")?.clear();
};

/**
 * @description 選択中のタブのエリア名
 *              Area name of the currently selected tab
 *
 * @type {Map}
 * @private
 */
let $selectTabName: ShortcutKeyStringImpl = "screen";

/**
 * @description 選択中のタブのエリア名を返却
 *              Returns the area name of the currently selected tab
 *
 * @return {string}
 * @method
 * @public
 */
export const $getSelectTabName = (): ShortcutKeyStringImpl =>
{
    return $selectTabName;
};

/**
 * @description 選択中のタブのエリア名を更新
 *              Update the area name of the currently selected tab
 *
 * @params {string} tab_name
 * @return {void}
 * @method
 * @public
 */
export const $setSelectTabName = (tab_name: ShortcutKeyStringImpl): void =>
{
    $selectTabName = tab_name;
};

/**
 * @description 送られてきた文字列からショートカットマッピングの文字列を生成
 *              Generate shortcut mapping strings from sent strings
 *
 * @return {Map}
 * @method
 * @public
 */
export const $generateShortcutKey = (
    key: string,
    options: ShortcutKeyOptionObjectImpl | null = null
): string => {

    let value: string = key.length === 1 ? key.toLowerCase() : key;
    if (options) {
        if (options.shift) {
            value += "Shift";
        }
        if (options.alt) {
            value += "Alt";
        }
        if (options.ctrl) {
            value += "Ctrl";
        }
    }
    return value;
};