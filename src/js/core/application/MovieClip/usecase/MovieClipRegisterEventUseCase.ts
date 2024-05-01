import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description スクリーンに配置するBitmapのイベントを登録する
 *              Register events for Bitmaps placed on the screen
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN, () => 
    {
        // TODO
    });
};