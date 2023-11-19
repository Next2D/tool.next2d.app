import { execute as shortcutSettingMenuRegisterKeyboardEventUseCase } from "./ShortcutSettingMenuRegisterKeyboardEventUseCase";
import { execute as shortcutSettingMenuLoadObjectUseCase } from "../usecase/ShortcutSettingMenuLoadObjectUseCase";
import { execute as shortcutSettingMenuUpdateElementTextService } from "../service/ShortcutSettingMenuUpdateElementTextService";
import { $updateShortcutSetting } from "../ShortcutSettingMenuUtil";

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

    // LocalStorageのデータをtempのマッピングにセット
    shortcutSettingMenuLoadObjectUseCase();

    // LocalStorageのデータがあれば表示を更新
    shortcutSettingMenuUpdateElementTextService();

    // キーボードイベントを登録
    shortcutSettingMenuRegisterKeyboardEventUseCase();
};