import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import { $setEditingElement } from "@/global/GlobalUtil";
import {
    $getMenu,
    $allHideMenu
} from "../../MenuUtil";

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
    const menu = $getMenu<ScreenTabMenu>($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    // 編集中のElementを初期化
    $setEditingElement(null);

    // メニューを非表示にする
    $allHideMenu($SCREEN_TAB_MENU_NAME);

    menu.show();
};