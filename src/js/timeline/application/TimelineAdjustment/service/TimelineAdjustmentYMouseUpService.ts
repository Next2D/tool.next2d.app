import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYMouseMoveService } from "./TimelineAdjustmentYMouseMoveService";
import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインの高さの調整イベントをwindowから削除
 *              Remove timeline height adjustment event from window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const height: number = parseFloat(document
        .documentElement
        .style
        .getPropertyValue("--timeline-logic-height"));

    // 高さを更新
    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState  = workSpace.timelineAreaState;
    timelineAreaState.height = height;

    // 移動したOffset値も更新
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (element) {
        timelineAreaState.offsetTop = element.offsetTop;
    }

    workSpace.updateTimelineArea(timelineAreaState);

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAdjustmentYMouseMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};