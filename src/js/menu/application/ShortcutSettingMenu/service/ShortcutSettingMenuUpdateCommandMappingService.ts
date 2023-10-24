import { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import {
    $clearCommandMapping,
    $getCommandMapping,
    $getTempMapping
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
    const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();

    // 上書き前に一度初期化
    $clearCommandMapping();

    const commandMapping: Map<ShortcutKeyStringImpl, Map<string, string>> = $getCommandMapping();
    for (const [areaName, mapping] of tempMapping) {

        if (!commandMapping.has(areaName)) {
            continue;
        }

        const commandMap: Map<string, string> = commandMapping.get(areaName) as NonNullable<Map<string, string>>;
        for (const shortcutObject of mapping.values()) {
            commandMap.set(
                shortcutObject.customKey,
                shortcutObject.defaultKey
            );
        }
    }
};