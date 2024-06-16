import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolCurrentFramePointerMoveEventUseCase } from "./TimelineToolCurrentFramePointerMoveEventUseCase";
import { execute as timelineToolCurrentFramePointerUpEventUseCase } from "./TimelineToolCurrentFramePointerUpEventUseCase";

/**
 * @description フレームの値をマウスムーブで可変させるwindowイベントを登録
 *              Register a window event to vary frame values with mouse moves.
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

    // イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        timelineToolCurrentFramePointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        timelineToolCurrentFramePointerUpEventUseCase,
        { "passive": false }
    );
};