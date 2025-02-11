import type { ShortcutSettingMenu } from "@/menu/domain/model/ShortcutSettingMenu";
import { $SHORTCUT_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

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
    const menu = $getMenu<ShortcutSettingMenu>($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SHORTCUT_MENU_NAME);

    menu.show();
};