import { execute as shortcutSettingMenuRegisterKeyboardEventUseCase } from "./ShortcutSettingMenuRegisterKeyboardEventUseCase";
import { execute as shortcutSettingMenuLoadObjectUseCase } from "../usecase/ShortcutSettingMenuLoadObjectUseCase";
import { execute as shortcutSettingMenuUpdateElementTextService } from "../service/ShortcutSettingMenuUpdateElementTextService";

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
    // LocalStorageのデータをtempのマッピングにセット
    shortcutSettingMenuLoadObjectUseCase();

    // LocalStorageのデータがあれば表示を更新
    shortcutSettingMenuUpdateElementTextService();

    // キーボードイベントを登録
    shortcutSettingMenuRegisterKeyboardEventUseCase();
};