import { EventType } from "@/tool/domain/event/EventType";
import { execute as strokeSizePointerMoveEventService } from "../service/StrokeSizePointerMoveEventService";
import { execute as zoomToolPointerUpEventUseCase } from "./StrokeSizePointerUpEventUseCase";

/**
 * @description 線の幅のinputのマウス操作イベントを登録
 *              Register mouse operation events for line width input
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
        strokeSizePointerMoveEventService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        zoomToolPointerUpEventUseCase,
        { "passive": false }
    );
};