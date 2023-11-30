import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { TimelineLayerControllerMenu } from "@/menu/domain/model/TimelineLayerControllerMenu";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

/**
 * @description レイヤーのコントローラーメニューを表示
 *              Display the Layer Controller menu
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
    $allHideMenu($TIMELINE_LAYER_MENU_NAME);

    const menu: MenuImpl<TimelineLayerControllerMenu> | null = $getMenu($TIMELINE_LAYER_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_MENU_NAME);

    if (!element) {
        return ;
    }

    // const colorElement: HTMLElement | null = document
    //     .getElementById("timeline-layer-color");

    // if (!colorElement) {
    //     return ;
    // }

    // if (!event.currentTarget) {
    //     return ;
    // }

    // const targetElement = event.currentTarget as HTMLElement;

    // const layerId: number = parseInt(targetElement.dataset.layerId as string);

    // const workSpace = $getCurrentWorkSpace();
    // const scene = workSpace.scene;

    // // TODO
    // console.log(layerId, scene);

    let top = event.pageY - element.clientHeight;
    if (0 > top) {
        top = 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;
    menu.show();
};