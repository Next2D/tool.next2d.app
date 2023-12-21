import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { execute as userShortcutObjectGetService } from "@/user/application/Shortcut/service/UserShortcutObjectGetService";
import {
    $clearCommandMapping,
    $clearTempMapping,
    $clearViewMapping,
    $getCommandMapping,
    $getViewMapping
} from "../ShortcutSettingMenuUtil";

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
    const userShortcutObjects: ShortcutViewObjectImpl[] | null = userShortcutObjectGetService();
    if (!userShortcutObjects) {
        return ;
    }

    // 初期化
    $clearCommandMapping();
    $clearViewMapping();
    $clearTempMapping();

    const commandMapping: Map<string, string> = $getCommandMapping();
    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();
    for (let idx: number = 0; idx < userShortcutObjects.length; ++idx) {
        const shortcutObject: ShortcutViewObjectImpl = userShortcutObjects[idx];

        // 表示マッピングをセット
        viewMapping.set(shortcutObject.defaultKey, shortcutObject);

        // コマンドのマッピングをセット
        commandMapping.set(shortcutObject.customKey, shortcutObject.defaultKey);
    }
};