import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAreaMouseDownEventUseCase } from "./TimelineAreaMouseDownEventUseCase";
import { execute as timelineAreaMouseUpEventUseCase } from "./TimelineAreaMouseUpEventUseCase";
import { execute as timelineAreaMouseOutEventService } from "../service/TimelineAreaMouseOutEventService";
import { execute as timelineAreaDeleteIconService } from "../service/TimelineAreaDeleteIconService";
import { $TIMELINE_CONTROLLER_BASE_ID, $TIMELINE_ID } from "@/config/TimelineConfig";

/**
 * @description タイムラインエリアの初期イベント登録
 *              Initial event registration in the timeline area
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document.getElementById($TIMELINE_ID);
    if (!element) {
        return ;
    }

    // タップ、ダブルタップの処理
    element.addEventListener(EventType.MOUSE_DOWN, timelineAreaMouseDownEventUseCase);
    element.addEventListener(EventType.MOUSE_UP, timelineAreaMouseUpEventUseCase);
    element.addEventListener(EventType.MOUSE_OUT, timelineAreaMouseOutEventService);

    const baseElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!baseElement) {
        return ;
    }

    baseElement.addEventListener(EventType.MOUSE_OVER, (): void =>
    {
        window.addEventListener("keypress", timelineAreaDeleteIconService);
    });

    baseElement.addEventListener(EventType.MOUSE_LEAVE, (): void =>
    {
        window.removeEventListener("keypress", timelineAreaDeleteIconService);
    });
};