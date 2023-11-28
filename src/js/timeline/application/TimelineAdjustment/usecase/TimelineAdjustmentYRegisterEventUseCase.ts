import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYMouseMoveUseCase } from "./TimelineAdjustmentYMouseMoveUseCase";
import { execute as timelineAdjustmentYMouseUpService } from "../service/TimelineAdjustmentYMouseUpService";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    event.preventDefault();

    // 全てのメニューを非表示にする
    $allHideMenu();

    // マウス移動イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, timelineAdjustmentYMouseMoveUseCase);
    window.addEventListener(EventType.MOUSE_UP, timelineAdjustmentYMouseUpService);
};