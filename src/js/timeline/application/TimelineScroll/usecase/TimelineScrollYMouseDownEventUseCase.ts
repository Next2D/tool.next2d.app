import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollYPointerMoveUseCase } from "./TimelineScrollYPointerMoveUseCase";
import { execute as timelineScrollYPointerUpUseCase } from "./TimelineScrollYPointerUpUseCase";

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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineScrollYPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineScrollYPointerUpUseCase,
        { "passive": false }
    );
};