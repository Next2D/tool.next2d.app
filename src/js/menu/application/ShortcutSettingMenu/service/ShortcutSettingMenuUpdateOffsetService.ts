import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ShortcutSettingMenu } from "../../../domain/model/ShortcutSettingMenu";
import { $getMenu } from "../../MenuUtil";
import {
    $SHORTCUT_MENU_NAME,
    $USER_MENU_NAME
} from "../../../../config/MenuConfig";
import { $TOOL_PREFIX, $TOOL_USER_SETTING_ID } from "../../../../config/ToolConfig";

/**
 * @description ショートカットメニューの表示位置のoffsetを更新
 *              Updated shortcut menu display position offset
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // ユーザーメニューオブジェクト
    const menu: MenuImpl<ShortcutSettingMenu> = $getMenu($SHORTCUT_MENU_NAME);
    if (!menu) {
        return ;
    }

    // ユーザー設定メニューのElement
    const userSettingMenu: HTMLElement | null = document
        .getElementById($USER_MENU_NAME);

    if (!userSettingMenu) {
        return ;
    }

    // ショートカットメニューのElement
    const shortcutSettingMenu: HTMLElement | null = document
        .getElementById($SHORTCUT_MENU_NAME);

    if (!shortcutSettingMenu) {
        return ;
    }

    let left: number = userSettingMenu.offsetLeft;
    if (left + shortcutSettingMenu.clientWidth > window.screen.width) {

        const tooArea: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!tooArea) {
            return ;
        }

        // ユーザー設定ツールのElement
        const userSettingTool: HTMLElement | null = document
            .getElementById($TOOL_USER_SETTING_ID);

        if (!userSettingTool) {
            return ;
        }

        left = tooArea.offsetLeft - userSettingTool.offsetLeft - shortcutSettingMenu.clientWidth;
    }

    // ユーザー設定メニューのoffset値に合わせる
    menu.offsetLeft = left;
    menu.offsetTop  = userSettingMenu.offsetTop;
};