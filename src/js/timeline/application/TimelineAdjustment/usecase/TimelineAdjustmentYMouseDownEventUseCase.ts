import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentYPointerMoveUseCase } from "./TimelineAdjustmentYPointerMoveUseCase";
import { execute as timelineAdjustmentYPointerUpUseCase } from "./TimelineAdjustmentYPointerUpUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description タイムラインの高さ調整のイベント開始処理
 *              Event start processing for timeline height adjustment
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示にする
    $allHideMenu();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // マウス移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.MOUSE_MOVE,
        timelineAdjustmentYPointerMoveUseCase
    );
    element.addEventListener(EventType.MOUSE_UP,
        timelineAdjustmentYPointerUpUseCase
    );
};