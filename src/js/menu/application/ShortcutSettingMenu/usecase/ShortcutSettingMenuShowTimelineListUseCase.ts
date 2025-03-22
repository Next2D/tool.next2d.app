import { execute as shortcutSettingMenuShowTimelineListService } from "../service/ShortcutSettingMenuShowTimelineListService";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";

/**
 * @description ショートカットリストのタイムライン表示時の処理
 *              Processing when displaying the timeline of the shortcut list
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

    // タイムラインリストを表示
    shortcutSettingMenuShowTimelineListService();
};