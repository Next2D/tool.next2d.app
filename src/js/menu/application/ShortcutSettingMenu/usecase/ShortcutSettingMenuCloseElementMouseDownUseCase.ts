import { $allHide } from "../../MenuUtil";
import { execute as userSettingMenuShowService } from "../../UserSettingMenu/service/UserSettingMenuShowService";

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
    // 全てのメニューを非表示にする
    $allHide();

    // ユーザー設定メニューを表示する
    userSettingMenuShowService();
};