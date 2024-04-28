import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingWidthWindowMouseMoveEventUseCase } from "./StageSettingWidthWindowMouseMoveEventUseCase";
import { execute as stageSettingWidthWindowMouseUpEventUseCase } from "./StageSettingWidthWindowMouseUpEventUseCase";

/**
 * @description ステージの幅の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage width numerical changes in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        stageSettingWidthWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        stageSettingWidthWindowMouseUpEventUseCase
    );
};