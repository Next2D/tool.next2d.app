import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingWidthWindowMouseMoveEventUseCase } from "./TransformSettingWidthWindowMouseMoveEventUseCase";
import { execute as transformSettingWidthWindowMouseUpEventUseCase } from "./TransformSettingWidthWindowMouseUpEventUseCase";

/**
 * @description 変形エリアの幅の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation event for numerical change of width of deformation area in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        transformSettingWidthWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        transformSettingWidthWindowMouseUpEventUseCase
    );
};