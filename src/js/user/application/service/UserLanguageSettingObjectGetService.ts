import { $USER_LANGUAGE_SETTING_KEY } from "../../../config/Config";

/**
 * @description 言語設定した値をLocalStorageから取得
 *              Retrieve language-set values from LocalStorage
 *
 * @return {string}
 * @method
 * @public
 */
export const execute = (): string | null =>
{
    return localStorage.getItem($USER_LANGUAGE_SETTING_KEY);
};