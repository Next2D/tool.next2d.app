import { $CONTROLLER_AREA_PROPERTY_BODY_ID } from "@/config/PropertyConfig";
import { propertyArea } from "@/controller/domain/model/PropertyArea";

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