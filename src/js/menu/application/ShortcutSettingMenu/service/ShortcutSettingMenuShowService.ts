import type { IMenu } from "@/interface/IMenu";
import type { ShortcutSettingMenu } from "@/menu/domain/model/ShortcutSettingMenu";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import { $SHORTCUT_MENU_NAME } from "@/config/MenuConfig";

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
    const menu: IMenu<ShortcutSettingMenu> | null = $getMenu($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SHORTCUT_MENU_NAME);

    menu.show();
};