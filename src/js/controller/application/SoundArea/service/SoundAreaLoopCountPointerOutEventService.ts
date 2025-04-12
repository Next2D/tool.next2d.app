import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ループ設定のInput Elementのマウスアウト処理関数
 *              Mouse out processing function of loop setting Input Element
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if ($useKeyboard()) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を停止
    event.stopPropagation();

    element.style.cursor = "";
};