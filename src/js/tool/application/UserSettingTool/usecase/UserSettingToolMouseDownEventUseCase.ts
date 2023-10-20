import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { $allHide } from "../../../../menu/application/MenuUtil";
import { execute as userSettingMenuShowService } from "../../../../menu/application/UserSettingMenu/service/UserSettingMenuShowService";
import { execute as userSettingMenuUpdateOffsetService } from "../../../../menu/application/UserSettingMenu/service/UserSettingMenuUpdateOffsetService";

/**
 * @description ユーザー設定ツールの選択時のユースケース
 *              Use cases when selecting user configuration tools
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
    $allHide($USER_MENU_NAME);

    // 表示位置を調整
    userSettingMenuUpdateOffsetService();

    // ユーザー設定のメニューを表示
    userSettingMenuShowService();
};