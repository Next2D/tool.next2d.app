import type { ShortcutObjectImpl } from "../../../../interface/ShortcutObjectImpl";
import { execute as shortcutSettingMenuListComponent } from "../component/ShortcutSettingMenuListComponent";
import { execute as shortcutSettingMenuChangeListStyleUseCase } from "../usecase/ShortcutSettingMenuChangeListStyleUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $SHORTCUT_LIBRARY_LIST,
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SCREEN_LIST,
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST,
    $SHORTCUT_TIMELINE_LIST_ID
} from "../../../../config/ShortcutConfig";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";
import type { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import type { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";

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

    const viewAreas: ShortcutKeyStringImpl[] = [
        "screen",
        "timeline",
        "library"
    ];
    const viewMapping: Map<ShortcutKeyStringImpl, Map<string, string>> = $getViewMapping();
    for (const [elementId, shortcutObjects] of areas) {

        const parent: HTMLElement | null = document.getElementById(elementId);
        if (!parent) {
            continue;
        }

        const areaName: ShortcutKeyStringImpl = viewAreas.shift() as NonNullable<ShortcutKeyStringImpl>;
        if (!viewMapping.has(areaName)) {
            continue;
        }

        const mapping: Map<string, string> | undefined = viewMapping.get(areaName);
        if (!mapping) {
            continue;
        }

        for (let idx: number = 0; idx < shortcutObjects.length; ++idx) {

            const shortcutObject: ShortcutObjectImpl = shortcutObjects[idx];

            const customText: string = mapping.has(shortcutObject.key)
                ? mapping.get(shortcutObject.key) as NonNullable<string>
                : "";

            parent.insertAdjacentHTML(
                "beforeend",
                shortcutSettingMenuListComponent(shortcutObject, customText)
            );

            const node: HTMLElement | null = parent.lastElementChild as HTMLElement;
            if (!node) {
                continue;
            }

            node.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
            {
                shortcutSettingMenuChangeListStyleUseCase(event);
            });
        }
    }
};