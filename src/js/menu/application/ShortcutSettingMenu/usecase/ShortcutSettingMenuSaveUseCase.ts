import { execute as userShortcutObjectUpdateService } from "@/user/application/Shortcut/service/UserShortcutObjectUpdateService";
import { execute as shortcutSettingMenuUpdateCommandMappingService } from "../service/ShortcutSettingMenuUpdateCommandMappingService";
import { execute as shortcutSettingMenuUpdateViewMappingService } from "../service/ShortcutSettingMenuUpdateViewMappingService";
import type { IShortcutViewObject } from "@/interface/IShortcutViewObject";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description tempに保存した個別のショートカット設定をLocalStorageに保存
 *              Save individual shortcut settings saved in temp to LocalStorage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // tempマッピングのデータをviewマッピングに上書き
    shortcutSettingMenuUpdateViewMappingService();

    // コマンドマップを更新
    shortcutSettingMenuUpdateCommandMappingService();

    // LocalStorage用の配列を生成
    const viewMapping: Map<string, IShortcutViewObject> = $getViewMapping();
    const object: IShortcutViewObject[] = [];
    for (const shortcutObject of viewMapping.values()) {
        object.push(shortcutObject);
    }

    // LocalStorageのデータを上書き
    userShortcutObjectUpdateService(object);
};