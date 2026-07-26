import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IBounds } from "@/interface/IBounds";
import { Matrix } from "@next2d/geom";
import { execute as characterCalcChildFrameService } from "@/core/application/Character/service/CharacterCalcChildFrameService";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import {
    $calcBoundingBox,
    $getCurrentWorkSpace,
    $getMatrixBounds
} from "../../CoreUtil";

/**
 * @description 指定のMovieClipの、指定フレームのbounding boxを計算
 *              子孫は階層ごとに矩形化せず、行列を合成して葉まで畳み込む
 *              Calculate the bounding box of the specified MovieClip at the specified frame.
 *              Descendants are folded down to the leaves with a concatenated matrix,
 *              without being reduced to a rectangle at each hierarchy.
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {Float32Array | null} [matrix=null]
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    frame: number = 1,
    matrix: Float32Array | null = null
): IBounds | null => {

    const workSpace = $getCurrentWorkSpace();

    const boundingBoxs: IBounds[] = [];
    for (let idx = 0; idx < movie_clip.layers.length; idx++) {
        const layer = movie_clip.layers[idx];
        if (!layer) {
            continue ;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        for (let idx = 0; idx < activeCharacters.length; idx++) {
            const character = activeCharacters[idx];
            if (!character) {
                continue ;
            }

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue ;
            }

            // 親から引き継いだ行列と合成
            const multiMatrix = matrix
                ? Matrix.multiply(matrix, character.matrix)
                : character.matrix;

            // MovieClipは矩形化せず、合成した行列を引き継いで再帰
            if (instance.type === $MOVIE_CLIP_TYPE) {

                const bounds = execute(
                    instance as MovieClip,
                    characterCalcChildFrameService(instance as MovieClip, character, frame),
                    multiMatrix
                );

                if (bounds) {
                    boundingBoxs.push(bounds);
                }

                continue ;
            }

            const rawBounds = instance.getRawBounds();
            if (!rawBounds) {
                continue ;
            }

            boundingBoxs.push($getMatrixBounds(
                rawBounds.xMin, rawBounds.yMin,
                rawBounds.xMax, rawBounds.yMax,
                multiMatrix
            ));
        }
    }

    return boundingBoxs.length
        ? $calcBoundingBox(boundingBoxs)
        : null;
};
