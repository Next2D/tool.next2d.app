import { EventType } from "@/tool/domain/event/EventType";
import { execute as scaleFrameWindowMouseMoveEventUseCase } from "./ScaleFrameWindowMouseMoveEventUseCase";
import { execute as scaleFrameWindowMouseUpEventUseCase } from "./ScaleFrameWindowMouseUpEventUseCase";

/**
 * @description フレームのスケール設定の数値変更のマウス操作イベントをwindowに登録
 *              Register the mouse operation event for changing the numerical value of the frame scale setting in the window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        scaleFrameWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        scaleFrameWindowMouseUpEventUseCase
    );
};