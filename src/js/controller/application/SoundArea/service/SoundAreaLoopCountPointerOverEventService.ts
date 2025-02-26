import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ループ回数入力エリアのマウスオーバー処理
 *              Mouse over processing of loop count input area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // フォーカスを移動用に変更
    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    element.style.cursor = "ew-resize";
};