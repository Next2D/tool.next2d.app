import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description ライブラリエリアのスクロールバーのマウスダウンイベント
 *              Mouse down event of the scroll bar in the library area
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを止める
    event.stopPropagation();

    // ポインターイベントを登録
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // ポインターイベントの登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        () => {},
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        () => {},
        { "passive": false }
    );
};