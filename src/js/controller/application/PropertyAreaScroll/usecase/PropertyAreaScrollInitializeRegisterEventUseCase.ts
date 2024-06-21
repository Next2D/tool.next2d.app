import { $PROPERTY_SCROLL_BAR_ID } from "@/config/PropertyConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaScrollMouseDownUseCase } from "./PropertyAreaScrollMouseDownUseCase";

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
    const element: HTMLElement | null = document
        .getElementById($PROPERTY_SCROLL_BAR_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        propertyAreaScrollMouseDownUseCase
    );
};