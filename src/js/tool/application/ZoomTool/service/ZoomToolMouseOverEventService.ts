import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ズームInputのマウスオーバーイベント
 *              Zoom Input mouse over event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 入力中は何もしない
    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.style.cursor = "ew-resize";
};