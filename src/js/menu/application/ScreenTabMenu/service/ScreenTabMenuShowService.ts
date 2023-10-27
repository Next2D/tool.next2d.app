import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ScreenTabMenu } from "../../../domain/model/ScreenTabMenu";
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
    const menu: MenuImpl<ScreenTabMenu> | null = $getMenu($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SCREEN_TAB_MENU_NAME);

    menu.show();
};