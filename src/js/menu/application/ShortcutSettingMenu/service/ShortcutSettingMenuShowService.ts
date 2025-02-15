import type { ShortcutSettingMenu } from "@/menu/domain/model/ShortcutSettingMenu";
import { $SHORTCUT_MENU_NAME } from "@/config/MenuConfig";
import { $setEditingElement } from "@/global/GlobalUtil";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

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
    const menu = $getMenu<ShortcutSettingMenu>($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    // 編集中のElementを初期化
    $setEditingElement(null);

    // メニューを非表示にする
    $allHideMenu($SHORTCUT_MENU_NAME);

    menu.show();
};