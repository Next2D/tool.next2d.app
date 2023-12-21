import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowScreenListService } from "../service/ShortcutSettingMenuShowScreenListService";

/**
 * @description ショートカットリストのスクリーン表示処理
 *              Shortcut list screen display process
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // スクリーンリストを表示
    shortcutSettingMenuShowScreenListService();
};