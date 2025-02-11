import type { UserSettingMenu } from "@/menu/domain/model/UserSettingMenu";
import { $USER_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

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
    const menu = $getMenu<UserSettingMenu>($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($USER_MENU_NAME);

    menu.show();
};