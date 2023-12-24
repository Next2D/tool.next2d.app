import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMarkerWindowMoveEventUseCase } from "./TimelineMarkerWindowMoveEventUseCase";
import { $setMoveMode } from "../../TimelineUtil";

/**
 * @description マーカー移動用の関数をwindowから削除
 *              Remove functions for moving markers from window
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

    // windowイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineMarkerWindowMoveEventUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    // 自動移動モード終了
    $setMoveMode(false);
};