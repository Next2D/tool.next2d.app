import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolCurrentFrameWindowMouseMoveEventService } from "../service/TimelineToolCurrentFrameWindowMouseMoveEventService";
import { execute as timelineToolCurrentFrameWindowMouseUpEventUseCase } from "./TimelineToolCurrentFrameWindowMouseUpEventUseCase";

/**
 * @description フレームの値をマウスムーブで可変させるwindowイベントを登録
 *              Register a window event to vary frame values with mouse moves.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineToolCurrentFrameWindowMouseMoveEventService
    );

    window.addEventListener(EventType.MOUSE_UP,
        timelineToolCurrentFrameWindowMouseUpEventUseCase
    );
};