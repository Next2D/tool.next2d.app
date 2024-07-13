import { $USER_STROKE_COLOR_KEY } from "@/config/Config";

/**
 * @description ツールエリアの線のカラー情報をLocalStorageに保存
 *              Save the line color information of the tool area in LocalStorage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (color: string): void =>
{
    localStorage.setItem($USER_STROKE_COLOR_KEY, color);
};