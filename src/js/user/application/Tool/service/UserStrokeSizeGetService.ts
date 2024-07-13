import { $USER_STROKE_WIDTH_KEY } from "@/config/Config";

/**
 * @description ツールエリアの線の幅の情報を返却
 *              Returns the line width information of the tool area
 *
 * @return {number}
 * @method
 * @public
 */
export const execute = (): number =>
{
    const size: string | null = localStorage.getItem($USER_STROKE_WIDTH_KEY);
    return size ? parseInt(size) : 0;
};