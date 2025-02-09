import { $USER_SETTING_KEY } from "@/config/Config";
import type { IUserSettingIObject } from "@/interface/IUserSettingIObject";

/**
 * @description ユーザー設定メニューで設定した値をLocalStorageに保存する
 *              Save the values set in the User Settings menu to LocalStorage
 *
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (object: IUserSettingIObject): void =>
{
    localStorage.setItem($USER_SETTING_KEY, JSON.stringify(object));
};