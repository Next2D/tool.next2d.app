import { $CONTROLLER_AREA_PROPERTY_BODY_ID } from "@/config/PropertyConfig";
import { propertyArea } from "@/controller/domain/model/PropertyArea";

/**
 * @description プロパティーエリアのスクロールバーのマウスムーブイベント
 *              Mouse move event of the property area scroll bar
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    if (!event.movementY) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const propertyAreaElement: HTMLElement | null = document
            .getElementById($CONTROLLER_AREA_PROPERTY_BODY_ID);

        if (!propertyAreaElement) {
            return ;
        }

        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        propertyAreaElement.scrollTop += event.movementY;
        element.style.top = `${propertyAreaElement.scrollTop * propertyArea.scrollScale}px`;
    });
};