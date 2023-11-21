import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定IDのElementを非アクティブに変更する
 *              Change the Element with the specified ID to inactive
 *
 * @params {HTMLElement} text_element
 * @params {HTMLElement} tab_element
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    text_element: HTMLElement,
    tab_element: HTMLElement
): void =>
{
    text_element.contentEditable   = "false";
    tab_element.style.borderBottom = "";
    $updateKeyLock(false);
};