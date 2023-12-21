import {
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST_ID
} from "@/config/ShortcutConfig";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";

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

    const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();
    for (let idx: number = 0; idx < parentElements.length; ++idx) {

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

            let text = node.dataset.defaultText as NonNullable<string>;
            if (viewMapping.size && viewMapping.has(defaultKey) ) {
                const viewObject: ShortcutViewObjectImpl | undefined = viewMapping.get(defaultKey);
                if (viewObject) {
                    text = viewObject.text;
                }
            }

            node.textContent = text;
        }
    }
};