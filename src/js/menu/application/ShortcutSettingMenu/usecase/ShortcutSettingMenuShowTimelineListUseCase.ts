import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowTimelineListService } from "../service/ShortcutSettingMenuShowTimelineListService";

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
    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // タイムラインリストを表示
    shortcutSettingMenuShowTimelineListService();
};