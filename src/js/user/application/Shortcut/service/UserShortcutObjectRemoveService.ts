import { $USER_SHORTCUT_SETTING_KEY } from "../../../../config/Config";

/**
 * @description 個別に設定したショートカット情報を全て削除
 *              Delete all individually configured shortcut information
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    localStorage.removeItem($USER_SHORTCUT_SETTING_KEY);
};