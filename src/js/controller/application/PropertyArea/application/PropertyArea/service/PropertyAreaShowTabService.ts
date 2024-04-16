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
    if (!propertyTabElement) {
        return ;
    }

    // プロパティタブを表示
    propertyTabElement.style.display = "";

    // アクティブに更新
    propertyTabElement.classList.remove("disable");
    propertyTabElement.classList.add("active");

    const targetElement: HTMLElement | null = document
        .getElementById(propertyTabElement.dataset.tabType as string);

    if (!targetElement) {
        return ;
    }

    // プロパティエリアを表示
    targetElement.style.display = "";

    // 他のタブを非アクティブにして非表示に更新
    const length: number = element.children.length;
    for (let idx: number = 1; idx < length; ++idx) {

        const node: HTMLElement | undefined = element.children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        // 非アクティブに更新
        node.classList.add("disable");
        node.classList.remove("active");

        const targetElement: HTMLElement | null = document
            .getElementById(node.dataset.tabType as string);

        if (!targetElement) {
            continue;
        }

        // 非表示に更新
        targetElement.style.display = "none";
    }
};