import { execute as userSettingMenuHideService } from "../service/UserSettingMenuHideService";
import { execute as shortcutSettingMenuUpdateOffsetService } from "../../ShortcutSettingMenu/service/ShortcutSettingMenuUpdateOffsetService";
import { execute as shortcutSettingMenuShowService } from "../../ShortcutSettingMenu/service/ShortcutSettingMenuShowService";

/**
 * @description ユーザー設定メニューのショートカットボタンのマウスダウンイベント
 *              Mouse down event for shortcut buttons in the user settings menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // ユーザー設定以外の全てのメニューを非表示にする
    userSettingMenuHideService();

    // 表示位置を補正
    shortcutSettingMenuUpdateOffsetService();

    // ショートカット設定のメニューを表示
    shortcutSettingMenuShowService();
};