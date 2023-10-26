import { execute as shortcutSettingMenuResetListStyleUseCase } from "../usecase/ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuRemoveKeyboardEventUseCase } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";
import { $clearTempMapping } from "../ShortcutSettingMenuUtil";
import { execute as shortcutSettingMenuLoadObjectUseCase } from "../usecase/ShortcutSettingMenuLoadObjectUseCase";

/**
 * @description ショートカットメニュー非表示時のユースケース
 *              Use case when the shortcut menu is hidden
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 選択したElementを初期化
    shortcutSettingMenuResetListStyleUseCase();

    // キーボードイベントを削除
    shortcutSettingMenuRemoveKeyboardEventUseCase();

    // 一時保存データを初期化
    $clearTempMapping();

    // LocalStorageのデータをtempのマッピングにセット
    shortcutSettingMenuLoadObjectUseCase();
};