import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description インスタス名の編集モードにセット
 *              Set to edit mode for Instas name
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 編集モードのstyleに更新
    element.contentEditable    = "true";
    element.style.borderBottom = "1px solid #f5f5f5";
    element.focus(); // fixed logic

    // 編集モードをOnにする
    $updateKeyLock(true);
};