import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYMouseMoveService } from "../service/TimelineAdjustmentYMouseMoveService";
import { execute as timelineAdjustmentYMouseUpService } from "../service/TimelineAdjustmentYMouseUpService";

/**
 * @description タイムラインの高さ調整のイベント開始処理
 *              Event start processing for timeline height adjustment
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // マウス移動イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, timelineAdjustmentYMouseMoveService);
    window.addEventListener(EventType.MOUSE_UP, timelineAdjustmentYMouseUpService);
};