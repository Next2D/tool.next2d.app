import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXPointerMoveUseCase } from "./TimelineScrollXPointerMoveUseCase";
import { execute as timelineScrollXPointerUpUseCase } from "./TimelineScrollXPointerUpUseCase";

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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineScrollXPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineScrollXPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        timelineScrollXPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        timelineScrollXPointerUpUseCase
    );
};