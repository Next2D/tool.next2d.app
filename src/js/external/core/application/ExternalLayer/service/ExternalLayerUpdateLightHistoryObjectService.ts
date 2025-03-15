import { $LAYER_LIGHT_UPDATE_COMMAND } from "@/config/HistoryConfig";
import type { IHistoryObject } from "@/interface/IHistoryObject";

/**
 * @description レイヤーのハイライトの画面共有オブジェクトを作成
 *              Create a screen-sharing object for layer highlighting
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
): IHistoryObject => {

    return {
        "command": $LAYER_LIGHT_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            index,
            value
        ],
        "args": []
    };
};