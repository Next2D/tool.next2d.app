import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaMouseOutEventService } from "../service/PropertyAreaMouseOutEventService";
import { execute as propertyAreaMouseUpEventUseCase } from "./PropertyAreaMouseUpEventUseCase";
import { execute as propertyAreaMouseDownEventUseCase } from "./PropertyAreaMouseDownEventUseCase";

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
        propertyAreaMouseDownEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        propertyAreaMouseUpEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        propertyAreaMouseUpEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_OUT,
        propertyAreaMouseOutEventService,
        { "passive": false }
    );
};