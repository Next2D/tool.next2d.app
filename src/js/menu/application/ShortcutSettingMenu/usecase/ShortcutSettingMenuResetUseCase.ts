import { execute as userShortcutObjectRemoveService } from "../../../../user/application/service/UserShortcutObjectRemoveService";
import { execute as shortcutSettingMenuUpdateElementTextService } from "../service/ShortcutSettingMenuUpdateElementTextService";
import { $clearTempMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストを初期設定に戻す
 *              Restore the shortcut list to its default settings
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // LocalStorageのデータを削除
    userShortcutObjectRemoveService();

    // tempデータを初期化
    $clearTempMapping();

    // コマンドマップを初期化
    $clearTempMapping();

    // 表示を更新
    shortcutSettingMenuUpdateElementTextService();
};