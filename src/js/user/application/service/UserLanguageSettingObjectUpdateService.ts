import { $USER_LANGUAGE_SETTING_KEY } from "../../../config/Config";

/**
 * @description 言語設定した値をLocalStorageに保存する
 *              Save language-set values to LocalStorage
 *
 * @param  {string} language
 * @return {void}
 * @method
 * @public
 */
export const execute = (language: string): void =>
{
    localStorage.setItem($USER_LANGUAGE_SETTING_KEY, language);
};