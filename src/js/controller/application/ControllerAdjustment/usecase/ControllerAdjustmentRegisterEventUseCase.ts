import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentMouseMoveUseCase } from "./ControllerAdjustmentMouseMoveUseCase";
import { execute as controllerAdjustmentMouseUpService } from "../service/ControllerAdjustmentMouseUpService";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示にする
    $allHideMenu();

    // マウス移動イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, controllerAdjustmentMouseMoveUseCase);
    window.addEventListener(EventType.MOUSE_UP, controllerAdjustmentMouseUpService);
};