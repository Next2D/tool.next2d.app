import type { MenuImpl } from "@/interface/MenuImpl";
import type { SceneListMenu } from "@/menu/domain/model/SceneListMenu";
import { $SCENE_LIST_MENU_NAME } from "@/config/MenuConfig";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import {
    $TIMELINE_ID,
    $TIMELINE_SCENE_LIST_BUTTON_ID,
    $TIMELINE_SCENE_NAME_LIST_ID
} from "@/config/TimelineConfig";

/**
 * @description シーン一覧メニューの画面を表示する
 *              Display the scene list menu screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // シーン一覧メニュー
    const menu: MenuImpl<SceneListMenu> | null = $getMenu($SCENE_LIST_MENU_NAME);
    if (!menu) {
        return ;
    }

    // 一覧がない時(root)はスキップ
    const listElement: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);
    if (!listElement || !listElement.children.length) {
        return ;
    }

    // 表示位置
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);
    if (!element) {
        return ;
    }

    const buttonElement: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_LIST_BUTTON_ID);
    if (!buttonElement) {
        return ;
    }

    // シーン名一覧メニュー以外を非表示
    $allHideMenu($SCENE_LIST_MENU_NAME);

    menu.offsetLeft = element.offsetLeft + buttonElement.offsetLeft + buttonElement.clientWidth + 5;
    menu.offsetTop  = element.offsetTop  + buttonElement.offsetTop  + buttonElement.clientHeight;
    menu.show();
};