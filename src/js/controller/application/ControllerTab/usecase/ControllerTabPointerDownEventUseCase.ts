import { $CONTROLLER_TAB_AREA_ID } from "@/config/ControllerConfig";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as libraryAreaScrollUpdateHeightService } from "@/controller/application/LibraryAreaScroll/service/LibraryAreaScrollUpdateHeightService";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";
import { execute as historyAreaScrollUpdateHeightService } from "@/controller/application/HistoryAreaScroll/service/HistoryAreaScrollUpdateHeightService";
import { execute as scriptAreaScrollUpdateHeightService } from "@/controller/application/ScriptAreaScroll/service/ScriptAreaScrollUpdateHeightService";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // アクティブなら何もしない
    const tabElement = event.currentTarget as HTMLElement;
    if (!tabElement || tabElement.classList.contains("active")) {
        return ;
    }

    // 表示されてるメニューをメニューを全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_TAB_AREA_ID);

    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx = 0; idx < length; ++idx) {

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
    tabElement.classList.remove("disable");
    tabElement.classList.add("active");

    const tabType = tabElement.dataset.tabType as string;

    const targetElement: HTMLElement | null = document
        .getElementById(tabType);

    if (!targetElement) {
        return ;
    }

    // 表示
    targetElement.style.display = "";

    switch (tabType) {

        // ライブラリエリア選択時の高さ調整
        case "controller-area-library":
            libraryAreaScrollUpdateHeightService();
            break;

        // プロパティエリア選択時の高さ調整
        case "controller-area-property":
            propertyAreaScrollUpdateHeightService();
            break;

        // プロパティエリア選択時の高さ調整
        case "controller-area-history":
            historyAreaScrollUpdateHeightService();
            break;

        // プロパティエリア選択時の高さ調整
        case "controller-area-js":
            scriptAreaScrollUpdateHeightService();
            break;

        default:
            break;

    }
};