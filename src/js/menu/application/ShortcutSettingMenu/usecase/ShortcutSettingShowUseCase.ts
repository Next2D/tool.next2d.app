import { execute as shortcutSettingMenuRegisterKeyboardEventUseCase } from "./ShortcutSettingMenuRegisterKeyboardEventUseCase";
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

    // キーボードイベントを登録
    shortcutSettingMenuRegisterKeyboardEventUseCase();

    // 一時保存データを初期化
    $clearTempMapping();
};