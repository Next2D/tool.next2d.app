import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";
import { $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description プロパティエリアのタイトルタップの実行関数
 *              Execution function of the title tap in the property area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const viewAreaElement: HTMLElement | null = document
        .getElementById(`${element.dataset.settingName}-setting-view-area`);

    if (!viewAreaElement) {
        return ;
    }

    const iconElements = element.getElementsByTagName("i");
    if (!iconElements.length) {
        return ;
    }

    const iconElement = iconElements[0] as HTMLElement;
    if (iconElement.classList.contains("active")) {
        // 表示を隠す
        iconElement.classList.remove("active");
        iconElement.classList.add("disable");
        viewAreaElement.style.display = "none";
    } else {
        // 表示する
        iconElement.classList.remove("disable");
        iconElement.classList.add("active");
        viewAreaElement.style.display = "";
    }

    // プロパティエリアのスクロールバーの高さを更新
    propertyAreaScrollUpdateHeightService();
};