import { $USER_MENU_NAME } from "../../../config/MenuConfig";
import { $getMenu } from "../../../menu/application/Menu";
import type { MenuImpl } from "../../../interface/MenuImpl";
import type { UserSettingMenu } from "../../../menu/domain/model/UserSettingMenu";

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

    menu.show();
};