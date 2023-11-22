import { $CONTROLLER_TAB_AREA_ID } from "@/config/ControllerConfig";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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

    // 表示されてるメニューをメニューを全て非表示にする
    $allHideMenu();

    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_TAB_AREA_ID);

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

        // 非アクティブに更新
        node.classList.remove("active");
        node.classList.add("disable");

        const activeElement: HTMLElement | null = document
            .getElementById(node.dataset.tabType as string);

        if (!activeElement) {
            continue;
        }

        // 非表示
        activeElement.style.display = "none";

        break;
    }

    // アクティブに更新
    const tabElement = event.currentTarget as HTMLElement;
    tabElement.classList.remove("disable");
    tabElement.classList.add("active");

    const targetElement: HTMLElement | null = document
        .getElementById(tabElement.dataset.tabType as string);

    if (!targetElement) {
        return ;
    }

    // 表示
    targetElement.style.display = "";
};