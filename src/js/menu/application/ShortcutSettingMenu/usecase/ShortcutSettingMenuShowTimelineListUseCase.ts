import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowTimelineListService } from "../service/ShortcutSettingMenuShowTimelineListService";
import { $setSelectTabName } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストのタイムライン表示時の処理
 *              Processing when displaying the timeline of the shortcut list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タブの選択状態をセット
    $setSelectTabName("timeline");

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // タイムラインリストを表示
    shortcutSettingMenuShowTimelineListService();
};