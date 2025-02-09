import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import type { IMenu } from "@/interface/IMenu";
import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import {
    $getMenu,
    $allHideMenu
} from "../../MenuUtil";

/**
 * @description ショートカットメニューを表示
 *              Show shortcut menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: IMenu<ScreenTabMenu> | null = $getMenu($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SCREEN_TAB_MENU_NAME);

    menu.show();
};