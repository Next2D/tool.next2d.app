import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMarkerWindowMoveEventUseCase } from "./TimelineMarkerWindowMoveEventUseCase";
import { execute as timelineMarkerRemoveWindowEventUseCase } from "./TimelineMarkerRemoveWindowEventUseCase";

/**
 * @description マーカー移動用の関数をwindowに登録
 *              Register functions for marker movement in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    // windowにイベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, timelineMarkerWindowMoveEventUseCase);
    window.addEventListener(EventType.MOUSE_UP, timelineMarkerRemoveWindowEventUseCase);
};