import { $USER_MENU_NAME } from "../../../config/MenuConfig";
import { $allHide } from "../../../menu/application/Menu";
import { execute as userSettingToolMouseDownEventService } from "../service/UserSettingToolMouseDownEventService";

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

    // ユーザー設定のメニューを表示
    userSettingToolMouseDownEventService();
};