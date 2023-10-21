import { execute as shortcutSettingMenuInitializeAppendElementUseCase } from "./ShortcutSettingMenuInitializeAppendElementUseCase";
import { execute as shortcutSettingMenuInitializeRegisterEventUseCase } from "./ShortcutSettingMenuInitializeRegisterEventUseCase";

/**
 * @description ショートカットメニューの初期起動ユースケース
 *              Initial startup use case for shortcut menus
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // デフォルトのショートカットのElementをリストに追加
    shortcutSettingMenuInitializeAppendElementUseCase();

    // 各ボタンのイベント登録
    shortcutSettingMenuInitializeRegisterEventUseCase();
};