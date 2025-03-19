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
    const userShortcutObjects = userShortcutObjectGetService();
    if (!userShortcutObjects) {
        return ;
    }

    // 初期化
    $clearCommandMapping();
    $clearViewMapping();
    $clearTempMapping();

    const commandMapping = $getCommandMapping();
    const viewMapping = $getViewMapping();
    for (let idx = 0; idx < userShortcutObjects.length; ++idx) {

        const shortcutObject = userShortcutObjects[idx];
        if (!shortcutObject) {
            continue;
        }

        // 表示マッピングをセット
        viewMapping.set(shortcutObject.defaultKey, shortcutObject);

        // コマンドのマッピングをセット
        commandMapping.set(shortcutObject.customKey, shortcutObject.defaultKey);
    }
};