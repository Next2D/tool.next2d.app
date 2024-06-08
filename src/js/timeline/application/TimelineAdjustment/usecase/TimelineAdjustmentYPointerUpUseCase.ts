import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYPointerMoveUseCase } from "./TimelineAdjustmentYPointerMoveUseCase";

/**
 * @description タイムラインの高さの調整イベントをwindowから削除
 *              Remove timeline height adjustment event from window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE,
        timelineAdjustmentYPointerMoveUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);
};