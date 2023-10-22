import { ShortcutKeyStringImpl } from "../../../interface/ShortcutKeyStringImpl";
import { ShortcutViewObjectImpl } from "../../../interface/ShortcutViewObjectImpl";

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
 * @description 表示に利用するマッピング
 *              Mapping used for display
 *
 * @type {Map}
 * @private
 */
const $viewMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = new Map([
    ["screen",   new Map()],
    ["timeline", new Map()],
    ["library",  new Map()],
    ["global",   new Map()]
]);

/**
 * @description 表示に利用するマッピングデータを返却
 *              Return mapping data for display
 *
 * @return {Map}
 * @method
 * @public
 */
export const $getViewMapping = ():  Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> =>
{
    return $viewMapping;
};