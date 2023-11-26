import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYMouseMoveUseCase } from "../usecase/TimelineAdjustmentYMouseMoveUseCase";

/**
 * @description タイムラインの高さの調整イベントをwindowから削除
 *              Remove timeline height adjustment event from window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAdjustmentYMouseMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};