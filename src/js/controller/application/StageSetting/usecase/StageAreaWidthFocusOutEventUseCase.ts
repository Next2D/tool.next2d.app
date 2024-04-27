import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ループ回数入力エリアのフォーカスイベント処理
 *              Focus event processing of loop count input area
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

    // 入力モードを終了する
    $updateKeyLock(false);
};