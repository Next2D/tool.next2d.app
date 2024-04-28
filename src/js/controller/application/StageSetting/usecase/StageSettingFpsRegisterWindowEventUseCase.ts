import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingFpsWindowMouseMoveEventUseCase } from "./StageSettingFpsWindowMouseMoveEventUseCase";
import { execute as stageSettingFpsWindowMouseUpEventUseCase } from "./StageSettingFpsWindowMouseUpEventUseCase";

/**
 * @description ステージのフレームレートの数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage frame rate numerical changes in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        stageSettingFpsWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        stageSettingFpsWindowMouseUpEventUseCase
    );
};