import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LAYER_UPDATE_LIGHT_COLOR_COMMAND } from "@/config/HistoryConfig";
import { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤーのハイライトカラー値の更新の履歴用オブジェクトを作成
 *              Create object for history of layer highlight color value updates
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} before_color
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    before_color: string
): HistoryObjectImpl => {

    return {
        "command": $LAYER_UPDATE_LIGHT_COLOR_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            before_color,
            layer.color
        ],
        "args": [
            movie_clip.name,
            layer.name
        ]
    };
};