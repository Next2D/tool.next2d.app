import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingXWindowMouseMoveEventUseCase } from "./TransformSettingXWindowMouseMoveEventUseCase";
import { execute as transformSettingXWindowMouseUpEventUseCase } from "./TransformSettingXWindowMouseUpEventUseCase";

/**
 * @description 変形エリアのx座標の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for numerical changes in x-coordinate of deformation area in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        transformSettingXWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        transformSettingXWindowMouseUpEventUseCase
    );
};