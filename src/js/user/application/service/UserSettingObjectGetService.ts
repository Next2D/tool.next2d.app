import { $USER_SETTING_KEY } from "../../../config/Config";
import type { UserSettingObjectImpl } from "../../../interface/UserSettingObjectImpl";

/**
 * @description ユーザー設定メニューで設定した値をLocalStorageから取得
 *              Retrieve values set in the User Settings menu from LocalStorage
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): UserSettingObjectImpl =>
{
    const json: string | null = localStorage.getItem($USER_SETTING_KEY);

    if (json) {
        return JSON.parse(json) as UserSettingObjectImpl;
    }

    return {
        "layer": false,
        "type": "zlib",
        "modal": true
    };
};