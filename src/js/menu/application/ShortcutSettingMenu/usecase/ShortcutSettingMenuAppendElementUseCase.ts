import type { ShortcutObjectImpl } from "@/interface/ShortcutObjectImpl";
import { execute as shortcutSettingMenuListComponent } from "../component/ShortcutSettingMenuListComponent";
import {
    $SHORTCUT_LIBRARY_LIST,
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SCREEN_LIST,
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST,
    $SHORTCUT_TIMELINE_LIST_ID
} from "@/config/ShortcutConfig";
import { $getTempMapping } from "../ShortcutSettingMenuUtil";
import type { ShortcutKeyStringImpl } from "@/interface/ShortcutKeyStringImpl";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";

/**
 * @description デフォルトのショートカットElementをメニューに追加
 *              Add default shortcut Element to menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const areas: Map<string, ShortcutObjectImpl[]> = new Map();
    areas.set($SHORTCUT_SCREEN_LIST_ID, $SHORTCUT_SCREEN_LIST);
    areas.set($SHORTCUT_TIMELINE_LIST_ID, $SHORTCUT_TIMELINE_LIST);
    areas.set($SHORTCUT_LIBRARY_LIST_ID, $SHORTCUT_LIBRARY_LIST);

    const areaNames: ShortcutKeyStringImpl[] = [
        "screen",
        "timeline",
        "library"
    ];
    const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();
    for (const [elementId, shortcutObjects] of areas) {

        const parent: HTMLElement | null = document.getElementById(elementId);
        if (!parent) {
            continue;
        }

        const areaName: ShortcutKeyStringImpl = areaNames.shift() as NonNullable<ShortcutKeyStringImpl>;
        if (!tempMapping.has(areaName)) {
            continue;
        }

        const mapping: Map<string, ShortcutViewObjectImpl> | undefined = tempMapping.get(areaName);
        if (!mapping) {
            continue;
        }

        for (let idx: number = 0; idx < shortcutObjects.length; ++idx) {

            const shortcutObject: ShortcutObjectImpl = shortcutObjects[idx];

            parent.insertAdjacentHTML(
                "beforeend",
                shortcutSettingMenuListComponent(shortcutObject)
            );
        }
    }
};