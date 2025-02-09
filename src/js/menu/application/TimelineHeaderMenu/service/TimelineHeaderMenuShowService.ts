import { $TIMELINE_HEADER_MENU_NAME } from "@/config/MenuConfig";
import type { TimelineHeaderMenu } from "@/menu/domain/model/TimelineHeaderMenu";
import type { IMenu } from "@/interface/IMenu";
import {
    $allHideMenu,
    $getMenu
} from "../../MenuUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

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
    if ($useKeyboard()) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示
    $allHideMenu($TIMELINE_HEADER_MENU_NAME);

    // 進行状況メニューを非表示に
    const menu: IMenu<TimelineHeaderMenu> | null = $getMenu($TIMELINE_HEADER_MENU_NAME);
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