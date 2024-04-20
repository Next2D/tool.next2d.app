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
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOnにする
    $updateKeyLock(true);

    // フォーカスを初期化
    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    element.style.cursor = "";
};