import { $USER_MENU_NAME } from "../../../const/MenuConfig";
import { $TOOL_USER_SETTING_ID } from "../../../const/ToolConfig";
import { $getMenu } from "../Menu";

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
    const userSettingMenu = $getMenu($USER_MENU_NAME);
    if (!userSettingMenu) {
        return ;
    }

    const menu: HTMLElement | null = document
        .getElementById($USER_MENU_NAME);

    if (!menu) {
        return ;
    }

    const tool: HTMLElement | null = document
        .getElementById($TOOL_USER_SETTING_ID);

    if (!tool) {
        return ;
    }

    userSettingMenu.offsetLeft = tool.offsetLeft + 30;
    userSettingMenu.offsetTop  = tool.offsetTop - menu.clientHeight + 80;
};