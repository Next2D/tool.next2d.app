import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowTimelineListService } from "../service/ShortcutSettingMenuShowTimelineListService";
import { $setSelectTabName } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストのタイムライン表示時の処理
 *              Processing when displaying the timeline of the shortcut list
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // タブの選択状態をセット
    $setSelectTabName("timeline");

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // タイムラインリストを表示
    shortcutSettingMenuShowTimelineListService();
};