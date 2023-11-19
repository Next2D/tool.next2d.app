import { execute as shortcutSettingMenuResetListStyleUseCase } from "../usecase/ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuRemoveKeyboardEventUseCase } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";
import { execute as shortcutSettingMenuLoadObjectUseCase } from "../usecase/ShortcutSettingMenuLoadObjectUseCase";
import {
    $clearTempMapping,
    $updateShortcutSetting
} from "../ShortcutSettingMenuUtil";

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
    // ショートカット設定が終了するのでフラグを更新
    $updateShortcutSetting(false);

    // 選択したElementを初期化
    shortcutSettingMenuResetListStyleUseCase();

    // キーボードイベントを削除
    shortcutSettingMenuRemoveKeyboardEventUseCase();

    // 一時保存データを初期化
    $clearTempMapping();

    // LocalStorageのデータをtempのマッピングにセット
    shortcutSettingMenuLoadObjectUseCase();
};