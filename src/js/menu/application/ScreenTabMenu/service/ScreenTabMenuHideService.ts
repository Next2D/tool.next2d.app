import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import { $getMenu } from "@/menu/application/MenuUtil";

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

    menu.hide();
};