import { $USER_SHORTCUT_SETTING_KEY } from "@/config/Config";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";

/**
 * @description 個別に設定したショートカット情報を返却
 *              Returns individually configured shortcut information
 *
 * @return {array}
 * @method
 * @public
 */
export const execute = (): ShortcutViewObjectImpl[] | null =>
{
    const json: string | null = localStorage.getItem($USER_SHORTCUT_SETTING_KEY);

    if (!json) {
        return null;
    }

    return JSON.parse(json) as ShortcutViewObjectImpl[];
};