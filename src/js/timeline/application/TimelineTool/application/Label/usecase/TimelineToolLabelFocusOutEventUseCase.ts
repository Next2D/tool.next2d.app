import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ラベルInputのフォーカスアウトイベント
 *              Label Input Focus Out Event
 *
 * @param {FocusEvent} event
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

    // TODO ラベルの追加処理を行う
};