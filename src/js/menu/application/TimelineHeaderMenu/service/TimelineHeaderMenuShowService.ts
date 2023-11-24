import { $TIMELINE_HEADER_MENU_NAME } from "@/config/MenuConfig";
import type { TimelineHeaderMenu } from "@/menu/domain/model/TimelineHeaderMenu";
import type { MenuImpl } from "@/interface/MenuImpl";
import {
    $allHideMenu,
    $getMenu
} from "../../MenuUtil";

/**
 * @description ヘッダーメニューを表示
 *              Show Header Menu
 *
 * @param  {MouseEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MouseEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示
    $allHideMenu();

    // 進行状況メニューを非表示に
    const menu: MenuImpl<TimelineHeaderMenu> | null = $getMenu($TIMELINE_HEADER_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_HEADER_MENU_NAME);

    if (!element) {
        return ;
    }

    let top = event.pageY - element.clientHeight;
    if (0 > top) {
        top = 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;
    menu.show();
};