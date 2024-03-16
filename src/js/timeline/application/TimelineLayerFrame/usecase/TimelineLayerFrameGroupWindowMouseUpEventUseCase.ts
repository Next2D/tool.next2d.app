import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameGroupInactiveElementService } from "../service/TimelineLayerFrameGroupInactiveElementService";
import { execute as timelineLayerFrameGroupWindowMouseMoveEventUseCase } from "./TimelineLayerFrameGroupWindowMouseMoveEventUseCase";

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

    // 選択したグループを非アクティブにする
    timelineLayerFrameGroupInactiveElementService();

    // イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameGroupWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);
};