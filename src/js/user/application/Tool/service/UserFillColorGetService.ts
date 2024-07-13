import { $USER_FILL_COLOR_KEY } from "@/config/Config";

/**
 * @description ツールエリアの塗りのカラー情報を返却
 *              Returns the fill color information of the tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const execute = (): string =>
{
    const color: string | null = localStorage.getItem($USER_FILL_COLOR_KEY);
    return color ? color : "#000000";
};