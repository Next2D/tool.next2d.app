import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAreaPointerDownEventUseCase } from "./TimelineAreaPointerDownEventUseCase";
import { execute as timelineAreaPointerUpEventUseCase } from "./TimelineAreaPointerUpEventUseCase";
import { execute as timelineAreaPointerOutEventService } from "../service/TimelineAreaPointerOutEventService";
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
    element.addEventListener(EventType.POINTER_DOWN, timelineAreaPointerDownEventUseCase);
    element.addEventListener(EventType.POINTER_UP, timelineAreaPointerUpEventUseCase);
    element.addEventListener(EventType.POINTER_OUT, timelineAreaPointerOutEventService);
};