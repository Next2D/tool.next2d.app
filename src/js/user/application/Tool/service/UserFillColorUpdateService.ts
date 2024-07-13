import { $USER_FILL_COLOR_KEY } from "@/config/Config";

/**
 * @description ツールエリアの塗りのカラー情報をLocalStorageに保存
 *              Save the fill color information of the tool area in LocalStorage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (color: string): void =>
{
    localStorage.setItem($USER_FILL_COLOR_KEY, color);
};