import { $setSelectElement } from "../ShortcutSettingMenuUtil";
import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";

/**
 * @description ショートカットリストの選択状態を初期化
 *              Initialize the selection state of the shortcut list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // styleを初期化
    shortcutSettingMenuChangeListStyleService(null);

    // 内部情報を初期化
    $setSelectElement(null); // fixed logic
};