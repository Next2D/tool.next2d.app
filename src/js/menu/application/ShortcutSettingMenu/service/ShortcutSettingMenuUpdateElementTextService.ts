import {
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST_ID
} from "../../../../config/ShortcutConfig";
import type { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import type { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $getTempMapping } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットのテキスト情報をtempデータを元に更新
 *              Update shortcut text information based on temp data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const parentElements: string[] = [
        $SHORTCUT_SCREEN_LIST_ID,
        $SHORTCUT_TIMELINE_LIST_ID,
        $SHORTCUT_LIBRARY_LIST_ID
    ];

    const areaNames: ShortcutKeyStringImpl[] = [
        "screen",
        "timeline",
        "library"
    ];

    const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();
    for (let idx: number = 0; idx < parentElements.length; ++idx) {

        const areaName: ShortcutKeyStringImpl = areaNames.shift() as NonNullable<ShortcutKeyStringImpl>;
        if (!tempMapping.has(areaName)) {
            continue;
        }

        const mapping: Map<string, ShortcutViewObjectImpl> | undefined = tempMapping.get(areaName);
        if (!mapping) {
            continue;
        }

        const parent: HTMLElement | null = document.getElementById(parentElements[idx]);
        if (!parent) {
            continue;
        }

        const children: HTMLCollection = parent.children;
        const length: number = children.length;

        for (let idx: number = 0; idx < length; ++idx) {
            const element: HTMLElement = children[idx] as HTMLElement;
            if (!element) {
                continue;
            }

            const commandElements = element.getElementsByClassName("command");
            if (!commandElements.length) {
                continue;
            }

            const node = commandElements[0] as HTMLElement;
            const defaultKey: string = node.dataset.defaultKey as NonNullable<string>;

            let text: string = node.dataset.defaultText as NonNullable<string>;
            if (mapping.has(defaultKey) ) {
                const object: ShortcutViewObjectImpl | undefined = mapping.get(defaultKey);
                if (object) {
                    text = object.text;
                }
            }
            node.textContent = text;
        }
    }
};