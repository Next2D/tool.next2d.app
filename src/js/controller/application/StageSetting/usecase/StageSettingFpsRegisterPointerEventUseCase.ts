import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingFpsPointerMoveEventUseCase } from "./StageSettingFpsPointerMoveEventUseCase";
import { execute as stageSettingFpsPointerUpEventUseCase } from "./StageSettingFpsPointerUpEventUseCase";

/**
 * @description ステージのフレームレートの数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage frame rate numerical changes in window
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

    // 移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        stageSettingFpsPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        stageSettingFpsPointerUpEventUseCase,
        { "passive": false }
    );
};