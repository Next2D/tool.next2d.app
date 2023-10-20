import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { UserSettingMenu } from "../../../domain/model/UserSettingMenu";
import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import {
    $TOOL_AERA_WIDTH,
    $TOOL_PREFIX,
    $TOOL_USER_SETTING_ID
} from "../../../../config/ToolConfig";

/**
 * @description ユーザー設定メニューの表示位置のoffsetを更新
 *              Updated display position offset in the User Preferences menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // ユーザーメニューオブジェクト
    const menu: MenuImpl<UserSettingMenu> = $getMenu($USER_MENU_NAME);
    if (!menu) {
        return ;
    }

    // ユーザーメニューのElement
    const userSettingMenu: HTMLElement | null = document
        .getElementById($USER_MENU_NAME);

    if (!userSettingMenu) {
        return ;
    }

    // ユーザー設定ツールのElement
    const userSettingTool: HTMLElement | null = document
        .getElementById($TOOL_USER_SETTING_ID);

    if (!userSettingTool) {
        return ;
    }

    // ユーザーエリアのElement
    const toolArea: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!toolArea) {
        return ;
    }

    let left: number = toolArea.offsetLeft + userSettingTool.offsetLeft + $TOOL_AERA_WIDTH;
    if (left + userSettingMenu.clientWidth > window.screen.width) {
        left = toolArea.offsetLeft - userSettingTool.offsetLeft - userSettingMenu.clientWidth;
    }

    menu.offsetLeft = left;
    menu.offsetTop  = toolArea.offsetTop + userSettingTool.offsetTop + userSettingTool.clientHeight - userSettingMenu.clientHeight;
};