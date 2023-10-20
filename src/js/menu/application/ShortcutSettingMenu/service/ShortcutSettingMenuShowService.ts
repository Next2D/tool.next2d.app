import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ShortcutSettingMenu } from "../../../domain/model/ShortcutSettingMenu";
import { $getMenu } from "../../MenuUtil";
import { $SHORTCUT_MENU_NAME } from "../../../../config/MenuConfig";

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
    const menu: MenuImpl<ShortcutSettingMenu> | null = $getMenu($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.show();
};