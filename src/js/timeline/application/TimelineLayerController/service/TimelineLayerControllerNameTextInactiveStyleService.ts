import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定のLayer IDの名前を編集モードを終了する
 *              Exit edit mode for the name of the specified Layer ID
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