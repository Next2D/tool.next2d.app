import { $SHORTCUT_MENU_NAME } from "../../../config/MenuConfig";
import { execute as menuAllHideService } from "../service/MenuAllHideService";
import { execute as userSettingMenuShortcutSettingMouseDownEventService } from "../service/UserSettingMenuShortcutSettingMouseDownEventService";

/**
 * @description ユーザー設定メニューのショートカットボタンのマウスダウンイベント
 *              Mouse down event for shortcut buttons in the user settings menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    // ユーザー設定以外の全てのメニューを非表示にする
    menuAllHideService($SHORTCUT_MENU_NAME);

    // ショートカット設定のメニューを表示
    userSettingMenuShortcutSettingMouseDownEventService();
};