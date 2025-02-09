import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentMouseMoveUseCase } from "./ControllerAdjustmentPointerMoveUseCase";

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
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, controllerAdjustmentMouseMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
};