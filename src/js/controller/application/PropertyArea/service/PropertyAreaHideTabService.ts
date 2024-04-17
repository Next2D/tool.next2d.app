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

    // 非アクティブに更新
    propertyTabElement.classList.remove("active");
    propertyTabElement.classList.add("disable");

    // 非表示にする
    propertyTabElement.style.display = "none";

    const libraryTabElement: HTMLElement | undefined = element.children[1] as HTMLElement;
    if (!libraryTabElement) {
        return ;
    }

    // ライブラリをアクティブに更新
    libraryTabElement.classList.add("active");
    libraryTabElement.classList.remove("disable");

    // ライブラリエリアを表示する
    const targetElement: HTMLElement | null = document
        .getElementById(libraryTabElement.dataset.tabType as string);

    if (!targetElement) {
        return ;
    }

    targetElement.style.display = "";
};