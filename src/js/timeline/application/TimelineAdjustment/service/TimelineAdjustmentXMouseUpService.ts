import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXMouseMoveService } from "./TimelineAdjustmentXMouseMoveService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインの幅の調整イベントをwindowから削除
 *              Remove timeline width adjustment event from window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const width: number = parseFloat(document
        .documentElement
        .style
        .getPropertyValue("--timeline-logic-width"));

    // 幅を更新
    const workSpace = $getCurrentWorkSpace();
    workSpace.timelineAreaState.width = width;

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAdjustmentXMouseMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};