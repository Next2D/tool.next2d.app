import { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import {
    $clearTempMapping,
    $getTempMapping,
    $getViewMapping
} from "../ShortcutSettingMenuUtil";

/**
 * @description 個別のショートカットのマッピングデータを更新
 *              Use case when the shortcut menu is hidden
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // tempデータから新しい設定を追加
    const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();
    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

    for (const [key, shortcutObject] of tempMapping) {
        viewMapping.set(key, shortcutObject);
    }

    // 初期化
    $clearTempMapping();
};