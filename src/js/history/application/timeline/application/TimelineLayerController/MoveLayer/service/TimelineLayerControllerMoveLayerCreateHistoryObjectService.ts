import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_MOVE_LAYER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} before_index
 * @param  {number} after_index
 * @param  {number} before_mode
 * @param  {number} before_parent_id
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    before_index: number,
    after_index: number,
    before_mode: number,
    before_parent_id: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_MOVE_LAYER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_index,
            after_index,
            before_mode,
            layer.mode,
            before_parent_id,
            layer.parentId
        ],
        "args": [
            movie_clip.name,
            layer.name
        ]
    };
};