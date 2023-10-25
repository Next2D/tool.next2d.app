import { $USER_SHORTCUT_SETTING_KEY } from "../../../../config/Config";
import type { ShortcutSaveObjectImpl } from "../../../../interface/ShortcutSaveObjectImpl";

/**
 * @description 個別に設定したショートカット情報を返却
 *              Returns individually configured shortcut information
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): ShortcutSaveObjectImpl | null =>
{
    const json: string | null = localStorage.getItem($USER_SHORTCUT_SETTING_KEY);

    if (!json) {
        return null;
    }

    return JSON.parse(json) as ShortcutSaveObjectImpl;
};