import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectWindowMouseMoveEventUseCase } from "./ScreenDisplayObjectPointerMoveEventUseCase";
import { execute as screenDisplayObjectWindowMouseUpEventUseCase } from "./ScreenDisplayObjectPointerUpEventUseCase";

/**
 * @description DisplayObjectの移動用のwindowイベントを登録
 *              Register window events for moving DisplayObjects
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        screenDisplayObjectWindowMouseMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        screenDisplayObjectWindowMouseUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        screenDisplayObjectWindowMouseUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        screenDisplayObjectWindowMouseUpEventUseCase
    );
};