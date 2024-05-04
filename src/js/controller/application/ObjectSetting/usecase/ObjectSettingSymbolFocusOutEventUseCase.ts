import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description シンボルのフォーカスアウトイベント処理
 *              Focus out event processing of symbol
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOffにする
    $updateKeyLock(false);
};