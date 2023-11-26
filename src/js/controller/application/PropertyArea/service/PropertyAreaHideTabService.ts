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
        propertyTabElement.classList.remove("active");
        propertyTabElement.classList.add("disable");
        propertyTabElement.style.display = "none";
    }

    const libraryTabElement: HTMLElement | undefined = element.children[1] as HTMLElement;
    if (libraryTabElement) {
        libraryTabElement.classList.add("active");
        libraryTabElement.classList.remove("disable");

        const element: HTMLElement | null = document
            .getElementById(libraryTabElement.dataset.tabType as string);

        if (element) {
            element.style.display = "";
        }
    }
};