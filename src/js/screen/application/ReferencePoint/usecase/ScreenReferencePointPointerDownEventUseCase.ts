import { $activeTouchPointers } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenReferencePointPointerMoveEventUseCase } from "./ScreenReferencePointPointerMoveEventUseCase";
import { execute as screenReferencePointPointerUpEventUseCase } from "./ScreenReferencePointPointerUpEventUseCase";

/**
 * @description 中心点elementのポインターダウンイベント
 *              Pointer down event for center point element
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return;
    }

    const element = event.target as HTMLElement;
    if (!element) {
        return;
    }

    event.stopPropagation();

    // カーソルを変更
    element.style.cursor = "grabbing";

    // 要素に対してポインターキャプチャを設定
    element.setPointerCapture(event.pointerId);

    // イベントを登録
    element.addEventListener(EventType.POINTER_MOVE,
        screenReferencePointPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(EventType.POINTER_UP,
        screenReferencePointPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_LEAVE,
        screenReferencePointPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_CANCEL,
        screenReferencePointPointerUpEventUseCase
    );
};