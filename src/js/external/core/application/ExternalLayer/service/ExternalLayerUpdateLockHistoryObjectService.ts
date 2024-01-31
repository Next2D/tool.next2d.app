import { $LAYER_LOCK_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
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
        "command": $LAYER_LOCK_UPDATE_COMMAND,
        "args": [
            work_space_id,
            movie_clip_id,
            index,
            value
        ]
    };
};