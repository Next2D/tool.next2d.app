import { execute as shortcutSettingMenuInitializeRegisterEventUseCase } from "./ShortcutSettingMenuInitializeRegisterEventUseCase";
import { execute as shortcutSettingMenuAppendElementUseCase } from "./ShortcutSettingMenuAppendElementUseCase";

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
    // ショートカットのElementを登録
    shortcutSettingMenuAppendElementUseCase();

    // 各ボタンのイベント登録
    shortcutSettingMenuInitializeRegisterEventUseCase();
};