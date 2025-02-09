import { $USER_SETTING_KEY } from "@/config/Config";
import type { IUserSettingIObject } from "@/interface/IUserSettingIObject";

/**
 * @description ユーザー設定メニューで設定した値をLocalStorageから取得
 *              Retrieve values set in the User Settings menu from LocalStorage
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): IUserSettingIObject =>
{
    const json: string | null = localStorage.getItem($USER_SETTING_KEY);

    if (json) {
        return JSON.parse(json) as IUserSettingIObject;
    }

    return {
        "layer": false,
        "type": "zlib",
        "modal": true
    };
};