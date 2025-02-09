import { EventType } from "@/tool/domain/event/EventType";
import { execute as zoomToolPointerMoveEventUseCase } from "./ZoomToolPointerMoveEventUseCase";
import { execute as zoomToolPointerUpEventUseCase } from "./ZoomToolPointerUpEventUseCase";

/**
 * @description ズームinputのマウス操作イベントを登録
 *              Register mouse operation events for zoom input
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        zoomToolPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        zoomToolPointerUpEventUseCase,
        { "passive": false }
    );
};