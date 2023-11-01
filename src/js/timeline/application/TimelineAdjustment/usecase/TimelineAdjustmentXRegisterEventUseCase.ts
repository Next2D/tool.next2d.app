import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as timelineAdjustmentXMouseMoveService } from "../service/TimelineAdjustmentXMouseMoveService";
import { execute as timelineAdjustmentXMouseUpService } from "../service/TimelineAdjustmentXMouseUpService";

/**
 * @description タイムラインの幅調整のイベント開始処理
 *              Timeline width adjustment event start processing
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
    window.addEventListener(EventType.MOUSE_MOVE, timelineAdjustmentXMouseMoveService);
    window.addEventListener(EventType.MOUSE_UP, timelineAdjustmentXMouseUpService);
};