import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import type { IBlendMode } from "@/interface/IBlendMode";
import { $CHARACTER_UPDATE_BLEND_MODE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectのブレンドモードを変更するための履歴オブジェクトを作成
 *              Create a history object for changing the blend mode of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {IBlendMode} blend_mode
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    blend_mode: IBlendMode
): IHistoryObject => {

    return {
        "command": $CHARACTER_UPDATE_BLEND_MODE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            character.blendMode,
            blend_mode
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            character.blendMode,
            blend_mode
        ]
    };
};