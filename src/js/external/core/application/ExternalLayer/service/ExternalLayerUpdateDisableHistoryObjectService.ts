import { $LAYER_DISABLE_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";

/**
 * @description レイヤー表示の画面共有オブジェクトを作成
 *              Create a screen-sharing object with a layered view
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} index
 * @param  {number} index
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    index: number,
    value: boolean
): HistoryObjectImpl => {

    return {
        "command": $LAYER_DISABLE_UPDATE_COMMAND,
        "args": [
            work_space_id,
            movie_clip_id,
            index,
            value
        ]
    };
};