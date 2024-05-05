import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 変形エリアのフォーカスイベント処理
 *              Focus event processing of the transformation area
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

    // フォーカスを初期化
    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 入力モードをOnにする
    $updateKeyLock(true);

    element.style.cursor = "";
};