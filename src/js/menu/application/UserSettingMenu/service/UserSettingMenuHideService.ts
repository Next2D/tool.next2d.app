import { $USER_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import type { IMenu } from "@/interface/IMenu";
import type { UserSettingMenu } from "@/menu/domain/model/UserSettingMenu";

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
    const menu: IMenu<UserSettingMenu> | null = $getMenu($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.hide();
};