import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMELINE_TOOL_LAYER_DELETE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description レイヤー削除の履歴用オブジェクトを作成
 *              Create object for layer deletion history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @param  {Layer} layer
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    index: number,
    layer: Layer
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            index,
            layer.toObject()
        ],
        "args": [
            movie_clip.name,
            layer.name
        ]
    };
};