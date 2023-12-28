import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollYWindowMoveUseCase } from "./TimelineScrollYWindowMoveUseCase";
import { execute as timelineScrollYWindowMouseUpUseCase } from "../usecase/TimelineScrollYWindowMouseUpUseCase";

/**
 * @description タイムラインのy座標の移動処理をwindowに登録
 *              Register the timeline y-approved movement process in the window
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

    window.addEventListener(EventType.MOUSE_MOVE, timelineScrollYWindowMoveUseCase);
    window.addEventListener(EventType.MOUSE_UP, timelineScrollYWindowMouseUpUseCase);
};