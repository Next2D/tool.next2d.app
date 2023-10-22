import {
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST_ID
} from "../../../../config/ShortcutConfig";

/**
 * @description ショートカットリストを削除して初期化
 *              Delete and initialize the shortcut list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    setTimeout(() =>
    {
        const areas = [
            $SHORTCUT_SCREEN_LIST_ID,
            $SHORTCUT_TIMELINE_LIST_ID,
            $SHORTCUT_LIBRARY_LIST_ID
        ];

        for (let idx: number = 0; idx < areas.length; ++idx) {

            const parent: HTMLElement | null = document.getElementById(areas[idx]);
            if (!parent) {
                continue;
            }

            while (parent.children.length) {
                parent.children[0].remove();
            }
        }
    }, 300);
};