import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollXBarPoiterMoveEventService } from "../service/ScreenScrollXBarPoiterMoveEventService";

/**
 * @description スクリーンエリアのxスクロールバーのマウスアップイベント
 *              Mouse up event of x scroll bar in screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, screenScrollXBarPoiterMoveEventService);
    element.removeEventListener(EventType.MOUSE_UP, execute);
};