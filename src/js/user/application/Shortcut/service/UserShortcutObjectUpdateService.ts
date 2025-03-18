import { $USER_SHORTCUT_SETTING_KEY } from "@/config/Config";
import type { IShortcutViewObject } from "@/interface/IShortcutViewObject";

/**
 * @description 個別に設定したショートカット情報をLocalStorageに保存
 *              Store individually configured shortcut information in LocalStorage
 *
 * @param  {IShortcutViewObject[]} values
 * @return {void}
 * @method
 * @public
 */
export const execute = (values: IShortcutViewObject[]): void =>
{
    localStorage.setItem($USER_SHORTCUT_SETTING_KEY, JSON.stringify(values));
};