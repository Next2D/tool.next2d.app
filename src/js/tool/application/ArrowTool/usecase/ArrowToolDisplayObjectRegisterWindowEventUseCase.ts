import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolDisplayObjectWindowMouseMoveEventUseCase } from "./ArrowToolDisplayObjectWindowMouseMoveEventUseCase";
import { execute as arrowToolDisplayObjectWindowMouseUpEventUseCase } from "./ArrowToolDisplayObjectWindowMouseUpEventUseCase";

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
        arrowToolDisplayObjectWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        arrowToolDisplayObjectWindowMouseUpEventUseCase
    );
};