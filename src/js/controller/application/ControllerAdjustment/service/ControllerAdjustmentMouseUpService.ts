import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentMouseMoveUseCase } from "../usecase/ControllerAdjustmentMouseMoveUseCase";

/**
 * @description タイムラインの幅の調整イベントをwindowから削除
 *              Remove timeline width adjustment event from window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 移動イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, controllerAdjustmentMouseMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};