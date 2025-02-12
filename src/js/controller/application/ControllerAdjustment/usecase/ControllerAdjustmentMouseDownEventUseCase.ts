import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentPointerMoveUseCase } from "./ControllerAdjustmentPointerMoveUseCase";
import { execute as controllerAdjustmentPointerUpUseCase } from "./ControllerAdjustmentPointerUpUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $CONTROLLER_ADJUSTMENT_ID } from "@/config/ControllerConfig";

/**
 * @description コントローラーの幅調整のイベント開始処理
 *              Controller width adjustment event start processing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_ADJUSTMENT_ID);

    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示にする
    $allHideMenu();

    // マウス移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        controllerAdjustmentPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        controllerAdjustmentPointerUpUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        controllerAdjustmentPointerUpUseCase,
        { "passive": false }
    );
};