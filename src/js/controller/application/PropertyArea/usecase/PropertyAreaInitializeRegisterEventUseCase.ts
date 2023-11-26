import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaTitleMouseDownEventService } from "../service/PropertyAreaTitleMouseDownEventService";
import { execute as propertyAreaMouseOutEventService } from "../service/PropertyAreaMouseOutEventService";
import { execute as propertyAreaMouseUpEventUseCase } from "../usecase/PropertyAreaMouseUpEventUseCase";
import { execute as propertyAreaMouseDownEventUseCase } from "../usecase/PropertyAreaMouseDownEventUseCase";

/**
 * @description プロパティーエリアの移動イベント登録
 *              Property Area Move Event Registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // プロパティーのタイトルにマウスダウンイベントを登録
    const elements: HTMLCollectionOf<Element> = document
        .getElementsByClassName("container-title");

    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const element: HTMLElement | undefined = elements[idx] as HTMLElement;
        if (!element) {
            continue;
        }

        element
            .addEventListener(
                EventType.MOUSE_DOWN,
                propertyAreaTitleMouseDownEventService
            );
    }

    // プロパティーエリアのイベント登録
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // タップ、ダブルタップの処理
    element.addEventListener(EventType.MOUSE_DOWN, propertyAreaMouseDownEventUseCase);
    element.addEventListener(EventType.MOUSE_UP, propertyAreaMouseUpEventUseCase);
    element.addEventListener(EventType.MOUSE_OUT, propertyAreaMouseOutEventService);
};