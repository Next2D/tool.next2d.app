import type { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import type { ShortcutSaveObjectImpl } from "../../../../interface/ShortcutSaveObjectImpl";
import type { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { execute as userShortcutObjectGetService } from "../../../../user/application/Shortcut/service/UserShortcutObjectGetService";
import { $getTempMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description LocalStorageの個別設定情報をtempマッピングにセット
 *              Set LocalStorage individual configuration information to temp mapping
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const userShortcutObject: ShortcutSaveObjectImpl | null = userShortcutObjectGetService();
    if (!userShortcutObject) {
        return ;
    }

    const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();
    for (const [areaName, mapping] of tempMapping) {
        const shortcutObjects: ShortcutViewObjectImpl[] = userShortcutObject[areaName];
        for (let idx: number = 0; idx < shortcutObjects.length; ++idx) {
            const shortcutObject: ShortcutViewObjectImpl = shortcutObjects[idx];
            mapping.set(shortcutObject.defaultKey, shortcutObject);
        }
    }
};