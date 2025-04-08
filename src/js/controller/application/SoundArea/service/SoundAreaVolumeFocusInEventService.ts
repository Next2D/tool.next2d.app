import { $setEditingElement } from "@/global/GlobalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 音量入力エリアのフォーカスイベント処理
 *              Focus event processing of volume input area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // フォーカスを初期化
    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOnにする
    $updateKeyLock(true);

    // 入力中のelementをセット
    $setEditingElement(element);

    element.style.cursor = "";
};