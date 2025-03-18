import { execute as userShortcutObjectUpdateService } from "@/user/application/Shortcut/service/UserShortcutObjectUpdateService";
import { execute as shortcutSettingMenuUpdateCommandMappingService } from "../service/ShortcutSettingMenuUpdateCommandMappingService";
import { execute as shortcutSettingMenuUpdateViewMappingService } from "../service/ShortcutSettingMenuUpdateViewMappingService";
import type { IShortcutViewObject } from "@/interface/IShortcutViewObject";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description tempに保存した個別のショートカット設定をLocalStorageに保存
 *              Save individual shortcut settings saved in temp to LocalStorage
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // tempマッピングのデータをviewマッピングに上書き
    shortcutSettingMenuUpdateViewMappingService();

    // コマンドマップを更新
    shortcutSettingMenuUpdateCommandMappingService();

    // LocalStorage用の配列を生成
    const viewMapping = $getViewMapping();
    const values = [];
    for (const shortcutObject of viewMapping.values()) {
        values.push(shortcutObject);
    }

    // LocalStorageのデータを上書き
    userShortcutObjectUpdateService(values);
};