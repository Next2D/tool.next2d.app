import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolCurrentFrameWindowMouseMoveEventService } from "../service/TimelineToolCurrentFrameWindowMouseMoveEventService";
import { $TIMELINE_CURRENT_FRAME_ID } from "@/config/TimelineConfig";
import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description フレームInputのElementのマウスアップ処理関数
 *              Mouse-up processing function of Element of frame Input
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineToolCurrentFrameWindowMouseMoveEventService
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CURRENT_FRAME_ID);

    if (!element) {
        return ;
    }

    element.focus();
};