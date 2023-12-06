import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXWindowMoveService } from "../service/TimelineScrollXWindowMoveService";

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
    window.removeEventListener(EventType.MOUSE_MOVE, timelineScrollXWindowMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};