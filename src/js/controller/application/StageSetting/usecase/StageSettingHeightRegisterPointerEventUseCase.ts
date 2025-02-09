import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingHeightPointerMoveEventUseCase } from "./StageSettingHeightPointerMoveEventUseCase";
import { execute as stageSettingHeightPointerUpEventUseCase } from "./StageSettingHeightPointerUpEventUseCase";

/**
 * @description ステージの高さの数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for stage height numerical changes in window
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
        EventType.POINTER_MOVE,
        stageSettingHeightPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        stageSettingHeightPointerUpEventUseCase,
        { "passive": false }
    );
};