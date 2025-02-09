import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineTargetGroupWindowMouseMoveEventUseCase } from "./TimelineTargetGroupWindowMouseMoveEventUseCase";
import { execute as timelineTargetGroupWindowMouseUpEventUseCase } from "./TimelineTargetGroupWindowMouseUpEventUseCase";

/**
 * @description フレームグループのwindowイベントを登録する
 *             Register window events for frame groups
 *
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

    // グループウィンドウのイベント
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineTargetGroupWindowMouseMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineTargetGroupWindowMouseUpEventUseCase,
        { "passive": false }
    );
};