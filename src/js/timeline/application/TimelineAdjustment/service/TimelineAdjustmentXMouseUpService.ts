import type { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXMouseMoveService } from "./TimelineAdjustmentXMouseMoveService";
import { execute as userTimelineAreaStateGetService } from "@/user/application/TimelineArea/service/UserTimelineAreaStateGetService";
import { execute as userTimelineAreaStateUpdateService } from "@/user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";

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

    // タイムラインの幅をLocalStorageに保存
    const UserTimelineAreaState: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();
    UserTimelineAreaState.width = width;
    userTimelineAreaStateUpdateService(UserTimelineAreaState);

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAdjustmentXMouseMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};