import { execute as shortcutSettingMenuShowScreenListService } from "../service/ShortcutSettingMenuShowScreenListService";
import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";

/**
 * @description ショートカットリストのスクリーン表示処理
 *              Shortcut list screen display process
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // 選択状態を初期化
    shortcutSettingMenuChangeListStyleService(null);

    // スクリーンリストを表示
    shortcutSettingMenuShowScreenListService();
};