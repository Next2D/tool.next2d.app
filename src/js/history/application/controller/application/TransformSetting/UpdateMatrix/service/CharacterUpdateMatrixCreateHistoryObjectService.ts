import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $CHARACTER_UPDATE_MATRIX_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectの行列変更の履歴用オブジェクトを作成
 *              Create a history object for changing the transformation matrix of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number[]} before_matrix
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_matrix: number[]
): IHistoryObject => {

    const afterMatrix = Array.from(character.matrix);
    return {
        "command": $CHARACTER_UPDATE_MATRIX_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            before_matrix,
            afterMatrix
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            `[${before_matrix.toString()}]`,
            `[${afterMatrix.toString()}]`
        ]
    };
};