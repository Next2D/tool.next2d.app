import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineTargetGroupInactiveElementService } from "../service/TimelineTargetGroupInactiveElementService";
import { execute as timelineTargetGroupWindowMouseMoveEventUseCase } from "./TimelineTargetGroupWindowMouseMoveEventUseCase";
import { $setMoveMode } from "../../TimelineUtil";

/**
 * @description グループウィンドウのマウスアップイベント
 *              Mouse up event of group window
 *
 * @param   {PointerEvent} event
 * @returns {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 自動移動モード終了
    $setMoveMode(false);

    // 選択したグループを非アクティブにする
    timelineTargetGroupInactiveElementService();

    // イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineTargetGroupWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);
};