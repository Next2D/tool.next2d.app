import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingYPointerMoveEventUseCase } from "./TransformSettingYPointerMoveEventUseCase";
import { execute as transformSettingYPointerUpEventUseCase } from "./TransformSettingYPointerUpEventUseCase";

/**
 * @description 変形エリアのy座標の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for numerical changes in y-coordinate of deformation area in window
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

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        transformSettingYPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        transformSettingYPointerUpEventUseCase,
        { "passive": false }
    );
};