import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectWindowMouseMoveEventUseCase } from "./ScreenDisplayObjectPointerMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";

/**
 * @description DisplayObjectのwindowイベントを解除
 *              Remove window events for DisplayObjects
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // windowイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE,
        screenDisplayObjectWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 移動した座標に更新
    screenDisplayObjectUpdateSelectedValueService();
};