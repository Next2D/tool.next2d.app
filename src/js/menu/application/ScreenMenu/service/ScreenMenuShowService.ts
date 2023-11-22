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

    $allHideMenu($SCREEN_MENU_NAME);

    // 進行状況メニューを非表示に
    const menu: MenuImpl<ScreenMenu> | null = $getMenu($SCREEN_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_MENU_NAME);

    if (!element) {
        return ;
    }

    const clientHeight: number = element.clientHeight;

    const height: number = clientHeight / 2;
    let top: number = event.pageY - height;
    if (0 > top) {
        top = 15;
    }

    if (event.pageY + height > window.innerHeight) {
        top = window.innerHeight - clientHeight - 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;

    menu.show();
};