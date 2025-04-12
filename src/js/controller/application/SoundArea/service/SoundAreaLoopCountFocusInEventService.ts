import { $setEditingElement } from "@/global/GlobalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ループ入力エリアのフォーカスイベント処理
 *              Focus event processing of loop input area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // フォーカスを初期化
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 入力モードをOnにする
    $updateKeyLock(true);

    // 入力中のelementをセット
    $setEditingElement(element);

    // イベントの伝播を止める
    event.stopPropagation();

    element.style.cursor = "";
};