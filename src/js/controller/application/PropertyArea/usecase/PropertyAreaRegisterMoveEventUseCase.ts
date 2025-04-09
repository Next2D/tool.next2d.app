import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaPointerOutEventService } from "../service/PropertyAreaPointerOutEventService";
import { execute as propertyAreaPointerUpEventUseCase } from "./PropertyAreaPointerUpEventUseCase";
import { execute as propertyAreaPointerDownEventUseCase } from "./PropertyAreaPointerDownEventUseCase";

/**
 * @description プロパティーエリアの移動イベントを登録
 *              Register property area move event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // プロパティーエリアのイベント登録
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // タップ、ダブルタップの処理
    element.addEventListener(EventType.POINTER_DOWN,
        propertyAreaPointerDownEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_UP,
        propertyAreaPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        propertyAreaPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_OUT,
        propertyAreaPointerOutEventService
    );
};