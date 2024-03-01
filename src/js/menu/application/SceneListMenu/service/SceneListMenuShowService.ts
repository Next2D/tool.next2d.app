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
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

    const buttonElement: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_LIST_BUTTON_ID);

    if (!buttonElement) {
        return ;
    }

    // シーン名一覧メニュー以外を非表示
    $allHideMenu($SCENE_LIST_MENU_NAME);

    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState = workSpace.timelineAreaState;

    // ベース
    const offsetX = buttonElement.offsetLeft + buttonElement.clientWidth + 5;
    const offsetY = buttonElement.offsetTop  + buttonElement.clientHeight;
    if (timelineAreaState.state === "fixed") {

        menu.offsetLeft = offsetX;
        menu.offsetTop  = offsetY;

    } else {

        // タイムラインの表示位置
        const timelineElement: HTMLElement | null = document
            .getElementById($TIMELINE_ID);

        if (!timelineElement) {
            return ;
        }

        menu.offsetLeft = timelineElement.offsetLeft + offsetX;
        menu.offsetTop  = timelineElement.offsetTop  + offsetY;
    }

    menu.show();
};