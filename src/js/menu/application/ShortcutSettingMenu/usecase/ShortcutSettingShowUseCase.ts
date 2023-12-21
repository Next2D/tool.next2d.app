import { execute as shortcutSettingMenuRegisterKeyboardEventUseCase } from "./ShortcutSettingMenuRegisterKeyboardEventUseCase";
import { execute as shortcutSettingMenuUpdateElementTextService } from "../service/ShortcutSettingMenuUpdateElementTextService";
import {
    $clearTempMapping,
    $updateShortcutSetting
} from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットメニュー表示ユースケース
 *              Shortcut menu display use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 既存のショートカットが起動しないようにフラグをセット
    $updateShortcutSetting(true);

    // LocalStorageのデータがあれば表示を更新
    shortcutSettingMenuUpdateElementTextService();

    // キーボードイベントを登録
    shortcutSettingMenuRegisterKeyboardEventUseCase();

    // 一時保存データを初期化
    $clearTempMapping();
};