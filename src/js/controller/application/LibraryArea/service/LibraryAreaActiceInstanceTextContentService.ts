import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description インスタスの名前もしくはシンボルを編集モードにセット
 *              Instas name or symbol set to edit mode
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