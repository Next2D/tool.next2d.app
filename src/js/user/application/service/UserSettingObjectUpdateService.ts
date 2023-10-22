import { $USER_SETTING_KEY } from "../../../config/Config";
import type { UserSettingObjectImpl } from "../../../interface/UserSettingObjectImpl";

/**
 * @description ユーザー設定メニューで設定した値をLocalStorageに保存する
 *              Save the values set in the User Settings menu to LocalStorage
 *
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (object: UserSettingObjectImpl): void =>
{
    localStorage.setItem($USER_SETTING_KEY, JSON.stringify(object));
};