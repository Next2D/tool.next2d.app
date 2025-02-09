import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingWidthWindowMouseMoveEventUseCase } from "./TransformSettingWidthPointerMoveEventUseCase";
import { execute as transformSettingWidthWindowMouseUpEventUseCase } from "./TransformSettingWidthPointerUpEventUseCase";

/**
 * @description 変形エリアの幅の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation event for numerical change of width of deformation area in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 移動のイベントを登録
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingWidthWindowMouseMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingWidthWindowMouseUpEventUseCase,
        { "passive": false }
    );
};