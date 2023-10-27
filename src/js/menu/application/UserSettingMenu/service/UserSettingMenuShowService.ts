import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "../../MenuUtil";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { UserSettingMenu } from "../../../domain/model/UserSettingMenu";

/**
 * @description ユーザー設定メニューの表示
 *              Displaying the User Preferences Menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: MenuImpl<UserSettingMenu> | null = $getMenu($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($USER_MENU_NAME);

    menu.show();
};