import { $SCREEN_MENU_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { ScreenMenu } from "@/menu/domain/model/ScreenMenu";
import { $allHideMenu, $getMenu } from "@/menu/application/MenuUtil";

/**
 * @description スクリーンエリアのメニューを表示
 *              Show screen area menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MouseEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 進行状況メニューを非表示に
    const menu: MenuImpl<ScreenMenu> | null = $getMenu($SCREEN_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SCREEN_MENU_NAME);

    menu.show();
};