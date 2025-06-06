import { $setEditingElement } from "@/global/GlobalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ズームInputのフォーカスイベント処理
 *              Zoom Input focus event processing
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードをOnにする
    $updateKeyLock(true);

    // 編集中のelementを設定
    $setEditingElement(element);

    element.style.cursor = "";
};