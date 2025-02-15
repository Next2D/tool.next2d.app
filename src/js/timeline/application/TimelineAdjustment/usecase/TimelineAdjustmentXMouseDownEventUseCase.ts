import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXPointerMoveUseCase } from "./TimelineAdjustmentXPointerMoveUseCase";
import { execute as timelineAdjustmentXPointerUpUseCase } from "./TimelineAdjustmentXPointerUpUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインの幅調整のイベント開始処理
 *              Timeline width adjustment event start processing
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

    // 編集中のElementを初期化
    $setEditingElement(null);

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // マウス移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineAdjustmentXPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineAdjustmentXPointerUpUseCase,
        { "passive": false }
    );
};