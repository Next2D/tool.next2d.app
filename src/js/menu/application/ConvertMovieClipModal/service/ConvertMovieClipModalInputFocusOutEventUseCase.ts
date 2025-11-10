import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ConvertMovieClipModalの入力フィールドからフォーカスが外れたときの処理
 *              Process when focus is lost from the input field of ConvertMovieClipModal
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);
};