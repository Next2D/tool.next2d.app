import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LAYER_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} before_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    before_name: string
): HistoryObjectImpl => {

    return {
        "command": $LAYER_NAME_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            before_name,
            layer.name
        ],
        "args": [
            movie_clip.name,
            before_name,
            layer.name
        ]
    };
};