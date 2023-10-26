import { execute as shortcutSettingMenuHideService } from "../service/ShortcutSettingMenuHideService";
import { execute as userSettingMenuShowService } from "../../UserSettingMenu/service/UserSettingMenuShowService";
import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuRemoveKeyboardEventService } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";

/**
 * @description ショートカットメニューを非表示にして、ユーザー設定メニューを表示
 *              Show shortcut menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // ショートカットメニューを非表示にする
    shortcutSettingMenuHideService();

    // ユーザー設定メニューを表示する
    userSettingMenuShowService();

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // キーボードイベントを削除
    shortcutSettingMenuRemoveKeyboardEventService();
};