import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description MovieClip変換エリアのInputのフォーカスイベント処理
 *              Focus event processing for the input in the MovieClip conversion area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // フォーカスを初期化
    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードをOnにする
    $updateKeyLock(true);

    // フォーカスを当てる
    $setEditingElement(element);
};