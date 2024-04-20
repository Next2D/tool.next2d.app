import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ラベルInputのフォーカスインイベント
 *              Label Input Focus In Event
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

    // 入力モードをOnにする
    $updateKeyLock(true);
};