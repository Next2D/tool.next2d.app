import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXMouseMoveUseCase } from "./TimelineAdjustmentXPointerMoveUseCase";

/**
 * @description タイムラインの幅の調整イベントをwindowから削除
 *              Remove timeline width adjustment event from window
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
        timelineAdjustmentXMouseMoveUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);
};