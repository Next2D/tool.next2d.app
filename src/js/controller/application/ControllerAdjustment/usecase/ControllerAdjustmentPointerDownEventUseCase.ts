import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentPointerMoveUseCase } from "./ControllerAdjustmentPointerMoveUseCase";
import { execute as controllerAdjustmentPointerUpUseCase } from "./ControllerAdjustmentPointerUpUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

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

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

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
        EventType.POINTER_CANCEL,
        controllerAdjustmentPointerUpUseCase,
        { "passive": false }
    );
};