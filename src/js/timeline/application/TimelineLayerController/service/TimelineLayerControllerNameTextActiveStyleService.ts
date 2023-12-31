import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定のElementの編集モードを有効にする
 *              Enable edit mode for a given Element
 *
 * @params {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 入力モードをOnにする
    $updateKeyLock(true);

    // 編集モードに切り替える
    element.contentEditable    = "true";
    element.style.borderBottom = "1px solid #f5f5f5";
    element.focus();
};