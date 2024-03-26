import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LAYER_UPDATE_LIGHT_COLOR_COMMAND } from "@/config/HistoryConfig";
import { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤーのモード更新の履歴用オブジェクトを作成
 *              Create a history object for updating the layer mode
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} before_mode
 * @param  {number} before_parent_id
 * @param  {array} indexes
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    before_mode: number,
    before_parent_id: number,
    indexes: number[],
    type_name: string
): HistoryObjectImpl => {

    return {
        "command": $LAYER_UPDATE_LIGHT_COLOR_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            before_mode,
            layer.mode,
            before_parent_id,
            layer.parentId,
            indexes
        ],
        "args": [
            movie_clip.name,
            layer.name,
            type_name
        ]
    };
};