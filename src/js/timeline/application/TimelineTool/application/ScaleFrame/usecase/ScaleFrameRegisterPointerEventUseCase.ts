import { EventType } from "@/tool/domain/event/EventType";
import { execute as scaleFramePointerMoveEventUseCase } from "./ScaleFramePointerMoveEventUseCase";
import { execute as scaleFramePointerUpEventUseCase } from "./ScaleFramePointerUpEventUseCase";

/**
 * @description フレームのスケール設定の数値変更のマウス操作イベントをwindowに登録
 *              Register the mouse operation event for changing the numerical value of the frame scale setting in the window
 *
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

    // イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        scaleFramePointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        scaleFramePointerUpEventUseCase,
        { "passive": false }
    );
};