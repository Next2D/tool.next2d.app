import { execute as shortcutSettingMenuInitializeRegisterEventUseCase } from "./ShortcutSettingMenuInitializeRegisterEventUseCase";
import { execute as shortcutSettingMenuAppendElementUseCase } from "./ShortcutSettingMenuAppendElementUseCase";
import { execute as shortcutSettingMenuLoadObjectUseCase } from "./ShortcutSettingMenuLoadObjectUseCase";

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
    // 各ボタンのイベント登録
    shortcutSettingMenuInitializeRegisterEventUseCase();

    // LocalStorageからデータを読み込む
    shortcutSettingMenuLoadObjectUseCase();

    // コマンドのテキストに置き換える
    // shortcutSettingMenuAppendElementUseCase();
};