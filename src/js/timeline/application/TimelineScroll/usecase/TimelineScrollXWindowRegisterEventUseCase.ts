import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXWindowMoveService } from "../service/TimelineScrollXWindowMoveService";
import { execute as timelineScrollXWindowMouseUpUseCase } from "../usecase/TimelineScrollXWindowMouseUpUseCase";

/**
 * @description タイムラインのx座標の移動処理をwindowに登録
 *              Register the timeline x-approved movement process in the window
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

    window.addEventListener(EventType.MOUSE_MOVE, timelineScrollXWindowMoveService);
    window.addEventListener(EventType.MOUSE_UP, timelineScrollXWindowMouseUpUseCase);
};