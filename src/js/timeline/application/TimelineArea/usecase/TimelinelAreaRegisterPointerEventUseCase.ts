import { EventType } from "@/tool/domain/event/EventType";
import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { execute as timelineAreaPointerMoveService } from "../service/TimelineAreaPointerMoveService";
import { execute as timelineAreaPointerUpUseCase } from "./TimelineAreaPointerUpUseCase";

/**
 * @description タイムラインエリアの移動関数をwindowに登録
 *              Register timeline area move function in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (!element) {
        return ;
    }

    // 画面イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineAreaPointerMoveService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineAreaPointerUpUseCase,
        { "passive": false }
    );
};