import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingYWindowMouseMoveEventUseCase } from "./TransformSettingYWindowMouseMoveEventUseCase";
import { execute as transformSettingYWindowMouseUpEventUseCase } from "./TransformSettingYWindowMouseUpEventUseCase";

/**
 * @description 変形エリアのy座標の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for numerical changes in y-coordinate of deformation area in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        transformSettingYWindowMouseMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        transformSettingYWindowMouseUpEventUseCase
    );
};