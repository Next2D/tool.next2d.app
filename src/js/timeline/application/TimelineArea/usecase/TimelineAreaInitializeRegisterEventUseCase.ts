import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAreaMouseDownEventUseCase } from "./TimelineAreaMouseDownEventUseCase";
import { execute as timelineAreaMouseUpEventUseCase } from "./TimelineAreaMouseUpEventUseCase";
import { execute as timelineAreaMouseOutEventService } from "../service/TimelineAreaMouseOutEventService";
import { $TIMELINE_ID } from "@/config/TimelineConfig";

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
    element.addEventListener(EventType.POINTER_DOWN, timelineAreaMouseDownEventUseCase);
    element.addEventListener(EventType.POINTER_UP, timelineAreaMouseUpEventUseCase);
    element.addEventListener(EventType.POINTER_OUT, timelineAreaMouseOutEventService);
};