import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { UserSettingMenu } from "../../../domain/model/UserSettingMenu";

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
    const menu: MenuImpl<UserSettingMenu> | null = $getMenu($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.hide();
};