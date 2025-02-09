import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMarkerPointerMoveEventUseCase } from "./TimelineMarkerPointerMoveEventUseCase";
import { $setMoveMode } from "../../TimelineUtil";
import { $setCursor } from "@/global/GlobalUtil";

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
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // windowイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, timelineMarkerPointerMoveEventUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);

    // カーソルを変更
    $setCursor("auto");

    // 自動移動モード終了
    $setMoveMode(false);
};