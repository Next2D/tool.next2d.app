import { $USER_STROKE_COLOR_KEY } from "@/config/Config";

/**
 * @description ツールエリアの線のカラー情報を返却
 *              Returns the line color information of the tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const execute = (): string =>
{
    const color: string | null = localStorage.getItem($USER_STROKE_COLOR_KEY);
    return color ? color : "#000000";
};