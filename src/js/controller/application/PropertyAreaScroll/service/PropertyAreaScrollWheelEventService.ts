import {
    $CONTROLLER_AREA_PROPERTY_BODY_ID,
    $PROPERTY_SCROLL_BAR_ID
} from "@/config/PropertyConfig";
import { propertyArea } from "@/controller/domain/model/PropertyArea";

/**
 * @description プロパティエリアのホイールイベント
 *              Property area wheel event
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const propertyAreaElement: HTMLElement | null = document
            .getElementById($CONTROLLER_AREA_PROPERTY_BODY_ID);

        if (!propertyAreaElement) {
            return ;
        }

        const scrollBarElement: HTMLElement | null = document
            .getElementById($PROPERTY_SCROLL_BAR_ID);

        if (!scrollBarElement) {
            return ;
        }

        propertyAreaElement.scrollTop += event.deltaY;
        scrollBarElement.style.top = `${propertyAreaElement.scrollTop * propertyArea.scrollScale}px`;
    });
};