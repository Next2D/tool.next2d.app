import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import { $getMenu } from "@/menu/application/MenuUtil";
import { execute as screenTabMenuShowService } from "../service/ScreenTabMenuShowService";
import { execute as screenTabMenuHideService } from "../service/ScreenTabMenuHideService";

/**
 * @description スクリーンタブの名前一覧のボタンのイベント処理関数
 *              Event handling functions for buttons in the screen tab name list
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const menu: MenuImpl<ScreenTabMenu> | null = $getMenu($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    if (menu.state === "hide") {
        screenTabMenuShowService();
    } else {
        screenTabMenuHideService();
    }
};