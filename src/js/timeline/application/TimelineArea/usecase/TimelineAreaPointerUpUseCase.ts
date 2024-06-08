import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setTimelineOffsetTop } from "../TimelineAreaUtil";
import { execute as timelineAreaPointerMoveService } from "../service/TimelineAreaPointerMoveService";

/**
 * @description 選択中のツールの移動イベント関数
 *              Move event function for the currently selected tool
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (!element) {
        return ;
    }

    // 登録されたイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, timelineAreaPointerMoveService);
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState = workSpace.timelineAreaState;

    timelineAreaState.state      = "move";
    timelineAreaState.offsetLeft = element.offsetLeft;
    timelineAreaState.offsetTop  = element.offsetTop;
    timelineAreaState.width      = element.clientWidth;
    timelineAreaState.height     = element.clientHeight;
    workSpace.updateTimelineArea(timelineAreaState);

    // タイムラインのOffsetTopを更新
    $setTimelineOffsetTop(element.offsetTop);
};