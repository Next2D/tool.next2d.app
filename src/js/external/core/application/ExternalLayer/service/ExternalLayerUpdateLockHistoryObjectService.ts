import { $LAYER_LOCK_UPDATE_COMMAND } from "@/config/HistoryConfig";
import { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";

/**
 * @description レイヤーロックの画面共有オブジェクトを作成
 *              Create a layer lock screen sharing object
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
        "messages": [
            work_space_id,
            movie_clip_id,
            index,
            value
        ],
        "args": []
    };
};