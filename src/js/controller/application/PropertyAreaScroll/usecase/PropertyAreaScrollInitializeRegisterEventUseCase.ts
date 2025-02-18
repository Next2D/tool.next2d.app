import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaScrollMouseDownUseCase } from "./PropertyAreaScrollMouseDownUseCase";
import { execute as propertyAreaScrollWheelEventService } from "../service/PropertyAreaScrollWheelEventService";
import {
    $PROPERTY_SCROLL_BAR_ID,
    $CONTROLLER_AREA_PROPERTY_ID
} from "@/config/PropertyConfig";

/**
 * @description プロパティーエリアのスクロールイベントを登録
 *              Register property area scroll events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scrollBarElement: HTMLElement | null = document
        .getElementById($PROPERTY_SCROLL_BAR_ID);

    // マウスダウンイベントを登録
    if (scrollBarElement) {
        scrollBarElement.addEventListener(EventType.POINTER_DOWN,
            propertyAreaScrollMouseDownUseCase
        );
    }

    const listElement: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (listElement) {
        listElement.addEventListener("wheel",
            propertyAreaScrollWheelEventService,
            { "passive": false }
        );
    }
};