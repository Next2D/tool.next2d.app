import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolCurrentFramePointerMoveEventUseCase } from "./TimelineToolCurrentFramePointerMoveEventUseCase";
import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description フレームInputのElementのマウスアップ処理関数
 *              Mouse-up processing function of Element of frame Input
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    $setCursor("auto");

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        timelineToolCurrentFramePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);

    element.focus();
};