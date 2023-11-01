import { UserTimelineAreaStateObjectImpl } from "../../../../interface/UserTimelineAreaStateObjectImpl";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as timelineAdjustmentYMouseMoveService } from "./TimelineAdjustmentYMouseMoveService";
import { execute as userTimelineAreaStateGetService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateGetService";
import { execute as userTimelineAreaStateUpdateService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";
import { $TIMELINE_ID } from "../../../../config/TimelineConfig";

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

    // タイムラインの幅をLocalStorageに保存
    const UserTimelineAreaState: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();
    UserTimelineAreaState.height = height;

    // 移動したOffset値も更新
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (element) {
        UserTimelineAreaState.offsetTop = element.offsetTop;
    }

    userTimelineAreaStateUpdateService(UserTimelineAreaState);

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAdjustmentYMouseMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};