import { $getTempMapping } from "../ShortcutSettingMenuUtil";
import { execute as userShortcutObjectUpdateService } from "../../../../user/application/Shortcut/service/UserShortcutObjectUpdateService";
import { execute as shortcutSettingMenuUpdateCommandMappingService } from "../service/ShortcutSettingMenuUpdateCommandMappingService";
import { execute as languageTranslationService } from "../../../../language/application/service/LanguageTranslationService";
import type { ShortcutSaveObjectImpl } from "../../../../interface/ShortcutSaveObjectImpl";
import type { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import type { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";

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
    // tempデータから新しい設定を追加
    const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();

    const object: ShortcutSaveObjectImpl = {
        "global": [],
        "library": [],
        "screen": [],
        "timeline": []
    };

    for (const [area, shortcutMapping] of tempMapping) {
        for (const shortcutObject of shortcutMapping.values()) {
            object[area].push(shortcutObject);
        }
    }

    // LocalStorageのデータを上書き
    userShortcutObjectUpdateService(object);

    // コマンドマップを更新
    shortcutSettingMenuUpdateCommandMappingService();

    // 変更があったショートカットの表示を更新
    languageTranslationService();
};