import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定のインスタンスの名前もしくはシンボルの編集モードを終了する
 *              Exit edit mode for the name or symbol of the specified instance
 *
 * @params {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // 入力モードをOnにする
    $updateKeyLock(false);

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 編集モードを終了する
    element.contentEditable    = "false";
    element.style.borderBottom = "";
};