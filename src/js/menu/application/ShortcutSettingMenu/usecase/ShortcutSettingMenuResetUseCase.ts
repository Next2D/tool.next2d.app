import { execute as userShortcutObjectRemoveService } from "@/user/application/Shortcut/service/UserShortcutObjectRemoveService";
import { execute as shortcutSettingMenuResetElementTextService } from "../service/ShortcutSettingMenuResetElementTextService";
import {
    $clearTempMapping,
    $clearViewMapping,
    $clearCommandMapping
} from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストを初期設定に戻す
 *              Restore the shortcut list to its default settings
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // LocalStorageのデータを削除
    userShortcutObjectRemoveService();

    // 表示を更新
    shortcutSettingMenuResetElementTextService();

    // データを初期化
    $clearTempMapping();
    $clearViewMapping();
    $clearCommandMapping();
};