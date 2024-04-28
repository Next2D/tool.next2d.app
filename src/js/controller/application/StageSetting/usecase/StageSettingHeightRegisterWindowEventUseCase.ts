import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingHeightWindowMouseMoveEventUseCase } from "./StageSettingHeightWindowMouseMoveEventUseCase";
import { execute as stageSettingHeightWindowMouseUpEventUseCase } from "./StageSettingHeightWindowMouseUpEventUseCase";

/**
 * @description ステージの高さの数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage height numerical changes in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        stageSettingHeightWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        stageSettingHeightWindowMouseUpEventUseCase
    );
};