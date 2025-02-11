import type { UserSettingMenu } from "@/menu/domain/model/UserSettingMenu";
import { $USER_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";

/**
 * @description ユーザー設定メニューを非表示にする
 *              Hide the User Preferences menu
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

    menu.hide();
};