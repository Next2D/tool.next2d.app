import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaPointerMoveService } from "../service/PropertyAreaPointerMoveService";
import { execute as propertyAreaPointerUpUseCase } from "./PropertyAreaPointerUpUseCase";

/**
 * @description プロパティエリアの移動関数をwindowに登録
 *              Register property area move function to window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // 画面イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        propertyAreaPointerMoveService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        propertyAreaPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        propertyAreaPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        propertyAreaPointerUpUseCase
    );
};