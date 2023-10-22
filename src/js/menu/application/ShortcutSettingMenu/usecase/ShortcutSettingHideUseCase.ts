import { execute as shortcutSettingMenuResetListStyleUseCase } from "../usecase/ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuRemoveKeyboardEventService } from "../service/ShortcutSettingMenuRemoveKeyboardEventService";
import { execute as shortcutSettingMenuRemoveElementService } from "../service/ShortcutSettingMenuRemoveElementService";

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
    shortcutSettingMenuRemoveKeyboardEventService();

    // リストのElementを全て削除
    shortcutSettingMenuRemoveElementService();
};