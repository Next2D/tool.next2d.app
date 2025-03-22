import { execute as shortcutSettingMenuShowLibraryListService } from "../service/ShortcutSettingMenuShowLibraryListService";
import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description ショートカットリストのライブラリ表示処理
 *              Shortcut list library display processing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    event.stopPropagation();
    event.preventDefault();

    // 選択状態を初期化
    shortcutSettingMenuChangeListStyleService(null);

    // ライブラリリストを表示
    shortcutSettingMenuShowLibraryListService();
};