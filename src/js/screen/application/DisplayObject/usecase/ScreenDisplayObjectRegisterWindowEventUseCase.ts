import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectWindowMouseMoveEventUseCase } from "./ScreenDisplayObjectWindowMouseMoveEventUseCase";
import { execute as screenDisplayObjectWindowMouseUpEventUseCase } from "./ScreenDisplayObjectWindowMouseUpEventUseCase";

/**
 * @description DisplayObjectの移動用のwindowイベントを登録
 *              Register window events for moving DisplayObjects
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        screenDisplayObjectWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        screenDisplayObjectWindowMouseUpEventUseCase
    );
};