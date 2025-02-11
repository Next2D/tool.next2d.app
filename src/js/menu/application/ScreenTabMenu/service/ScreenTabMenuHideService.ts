import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";

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

    menu.hide();
};