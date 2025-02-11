import type { TimelineLayerControllerMenu } from "@/menu/domain/model/TimelineLayerControllerMenu";
import { $TIMELINE_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

/**
 * @description レイヤーのフレーム側のメニューを表示
 *              Display the menu on the frame side of the layer
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
    $allHideMenu($TIMELINE_MENU_NAME);

    const menu = $getMenu<TimelineLayerControllerMenu>($TIMELINE_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_NAME);

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