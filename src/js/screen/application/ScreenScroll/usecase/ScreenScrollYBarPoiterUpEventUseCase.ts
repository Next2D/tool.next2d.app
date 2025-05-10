import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollYBarPoiterMoveEventService } from "../service/ScreenScrollYBarPoiterMoveEventService";

/**
 * @description スクリーンエリアのyスクロールバーのマウスアップイベント
 *              Mouse up event of y scroll bar in screen area
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

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, screenScrollYBarPoiterMoveEventService);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};