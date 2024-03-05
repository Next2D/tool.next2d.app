import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "@/config/HistoryConfig";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip
 * @param  {Layer} layer
 * @param  {number} index
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    index: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_TOOL_LAYER_ADD_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            index,
            layer.name,
            layer.color
        ],
        "args": [
            movie_clip.name,
            layer.name
        ]
    };
};