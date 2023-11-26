import { $CONTROLLER_TAB_AREA_ID } from "@/config/ControllerConfig";

/**
 * @description プロパティのタブを表示
 *              Show property tabs
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_TAB_AREA_ID);

    if (!element) {
        return ;
    }

    const propertyTabElement: HTMLElement | undefined = element.children[0] as HTMLElement;
    if (propertyTabElement) {
        propertyTabElement.style.display = "";

        const element: HTMLElement | null = document
            .getElementById(propertyTabElement.dataset.tabType as string);

        if (element) {
            element.style.display = "none";
        }
    }
};