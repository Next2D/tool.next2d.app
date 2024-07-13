import { $USER_STROKE_WIDTH_KEY } from "@/config/Config";

/**
 * @description ツールエリアの線の幅の情報をLocalStorageに保存
 *              Save the line width information of the tool area in LocalStorage
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const execute = (width: number): void =>
{
    localStorage.setItem($USER_STROKE_WIDTH_KEY, `${width}`);
};