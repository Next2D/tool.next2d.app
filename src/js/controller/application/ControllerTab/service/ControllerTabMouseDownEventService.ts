import { $CONTROLLER_TAB_AREA_NAME } from "@/config/ControllerConfig";

/**
 * @description タブのタップイベント処理関数
 *              Tap event processing function for tabs
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_TAB_AREA_NAME);

    if (!element) {
        return ;
    }

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node || !node.classList.contains("active")) {
            continue;
        }

        node.classList.remove("active");
        node.classList.add("disable");

        const activeElement: HTMLElement | null = document
            .getElementById(node.dataset.tabType as string);

        if (!activeElement) {
            continue;
        }

        activeElement.style.display = "none";

        break;
    }

    const targetElement = event.currentTarget as HTMLElement;
    targetElement.classList.remove("disable");
    targetElement.classList.add("active");

    const activeElement: HTMLElement | null = document
        .getElementById(targetElement.dataset.tabType as string);

    if (!activeElement) {
        return ;
    }

    activeElement.style.display = "";
};