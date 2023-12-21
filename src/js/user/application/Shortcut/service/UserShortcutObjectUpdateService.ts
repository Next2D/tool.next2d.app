import { $USER_SHORTCUT_SETTING_KEY } from "@/config/Config";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";

/**
 * @description 個別に設定したショートカット情報をLocalStorageに保存
 *              Store individually configured shortcut information in LocalStorage
 *
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (object: ShortcutViewObjectImpl[]): void =>
{
    localStorage.setItem($USER_SHORTCUT_SETTING_KEY, JSON.stringify(object));
};