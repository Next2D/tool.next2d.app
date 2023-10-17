import { $SHORTCUT_MENU_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import { $getMenu } from "../../Menu";
import { UserSettingMenu } from "../../../domain/model/UserSettingMenu";

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
    const menu: MenuImpl<UserSettingMenu> | null = $getMenu($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.show();
};