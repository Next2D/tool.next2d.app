import { execute as shortcutSettingMenuAppendElementUseCase } from "../usecase/ShortcutSettingMenuAppendElementUseCase";
import { execute as shortcutSettingMenuRegisterKeyboardEventService } from "../service/ShortcutSettingMenuRegisterKeyboardEventService";

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
    // ショートカットのElementを各リストに追加
    shortcutSettingMenuAppendElementUseCase();

    // キーボードイベントを登録
    shortcutSettingMenuRegisterKeyboardEventService();
};