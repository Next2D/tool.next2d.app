import type { UserSettingMenu } from "@/menu/domain/model/UserSettingMenu";
import { $USER_MENU_NAME } from "@/config/MenuConfig";
import { $setEditingElement } from "@/global/GlobalUtil";
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

    // メニューを非表示にする
    $allHideMenu($USER_MENU_NAME);

    // 編集中のElementを初期化
    $setEditingElement(null);

    menu.show();
};