import { IShortcutViewObject } from "@/interface/IShortcutViewObject";
import {
    $clearCommandMapping,
    $getCommandMapping,
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
    // 上書き前に一度初期化
    $clearCommandMapping();

    const commandMapping: Map<string, string> = $getCommandMapping();
    const viewMapping: Map<string, IShortcutViewObject> = $getViewMapping();
    for (const shortcutObject of viewMapping.values()) {
        commandMapping.set(
            shortcutObject.customKey,
            shortcutObject.defaultKey
        );
    }
};