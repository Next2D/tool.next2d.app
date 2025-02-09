import { $USER_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import type { IMenu } from "@/interface/IMenu";
import type { UserSettingMenu } from "@/menu/domain/model/UserSettingMenu";

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
    const menu: IMenu<UserSettingMenu> | null = $getMenu($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($USER_MENU_NAME);

    menu.show();
};