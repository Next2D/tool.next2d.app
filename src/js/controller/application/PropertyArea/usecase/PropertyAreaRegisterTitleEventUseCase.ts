import { EventType } from "@/tool/domain/event/EventType";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { execute as propertyAreaTitleMouseDownEventService } from "../service/PropertyAreaTitleMouseDownEventService";

/**
 * @description プロパティーエリアのタイトルのマウスダウンイベントを登録
 *              Register the mouse down event of the property area title
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

    // プロパティーのタイトルにマウスダウンイベントを登録
    const elements = element
        .querySelectorAll(".container-title");

    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = elements[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        node
            .addEventListener(
                EventType.MOUSE_DOWN,
                propertyAreaTitleMouseDownEventService
            );
    }
};