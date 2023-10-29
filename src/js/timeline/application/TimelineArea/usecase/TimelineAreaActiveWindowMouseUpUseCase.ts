import { $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { $setCursor } from "../../../../util/Global";
import { execute as timelineAreaActiveWindowMoveService } from "../service/TimelineAreaActiveWindowMoveService";
import { execute as userTimelineAreaStateUpdateService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";

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

    // 登録されたイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineAreaActiveWindowMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (!element) {
        return ;
    }

    // ツールエリアを移動
    element.style.left = `${element.offsetLeft + event.movementX}px`;
    element.style.top  = `${element.offsetTop  + event.movementY}px`;

    // 移動状態をLocalStorageに保存
    userTimelineAreaStateUpdateService({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });
};