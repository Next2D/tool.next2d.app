import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageAreaWidthWindowMouseMoveEventUseCase } from "./StageAreaWidthWindowMouseMoveEventUseCase";
import { execute as stageAreaWidthWindowMouseUpEventUseCase } from "./StageAreaWidthWindowMouseUpEventUseCase";

/**
 * @description ステージエリア数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage area numerical changes in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        stageAreaWidthWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        stageAreaWidthWindowMouseUpEventUseCase
    );
};