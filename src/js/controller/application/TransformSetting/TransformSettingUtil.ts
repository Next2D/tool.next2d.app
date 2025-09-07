import type { Character } from "@/core/domain/model/Character";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Matrix } from "@next2d/geom";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE,
    $SHAPE_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description 親のMovieClipとスクリーンの拡大率の行列を返却
 *              Returns the matrix of the parent MovieClip and the screen magnification
 *
 * @return {Float32Array}
 * @method
 * @public
 */
export const $getConcatenatedMatrix = (): Float32Array =>
{
    const workSpace = $getCurrentWorkSpace();

    const matrix = new Float32Array([workSpace.scale, 0, 0, workSpace.scale, 0, 0]);
    for (let idx = 0; idx < timelineSceneList.parents.length; idx++) {

        const parentObject = timelineSceneList.parents[idx];
        if (!parentObject) {
            continue;
        }

        const character = parentObject.selectCharacter;
        if (!character) {
            continue;
        }

        const multiMatrix = Matrix.multiply(matrix, character.matrix);
        matrix.set(multiMatrix);
    }

    return matrix;
};

/**
 * @description TransformStyleを生成
 *              Generate TransformStyle
 *
 * @param  {Character} character
 * @return {string}
 * @method
 * @public
 */
export const $createTransformElementStyle = (character: Character): string =>
{
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = Matrix.multiply(concatenatedMatrix, character.matrix);
    const radianX = Math.atan2(matrix[1], matrix[0]);
    const radianY = Math.atan2(matrix[2], matrix[3]);
    return `matrix(${Math.cos(radianX)}, ${Math.sin(radianX)}, ${Math.sin(radianY)}, ${Math.cos(radianY)}, 0, 0)`;
};

/**
 * @description Bitmapのマスク用の行列を返却
 *              Returns the matrix for the mask of the Bitmap
 *
 * @param  {Character} character
 * @return {Float32Array}
 * @method
 * @public
 */
export const $getElementMaskMatrix = (character: Character): Float32Array =>
{
    const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    const concatenatedMatrix = $getConcatenatedMatrix();
    const multiMatrix = Matrix.multiply(concatenatedMatrix, character.matrix);

    matrix[0] = characterCalcGetScaleXService(multiMatrix);
    matrix[3] = characterCalcGetScaleYService(multiMatrix);

    // 変形分の座標を補正
    matrix[4] = concatenatedMatrix[4];
    matrix[5] = concatenatedMatrix[5];

    return matrix;
};

/**
 * @description アイテムタイプに合わせたマスク用の行列を返却
 *              Returns the matrix for the mask according to the item type
 *
 * @param  {Character} character
 * @return {Float32Array}
 * @method
 * @public
 */
export const $getMaskMatrix = (character: Character): Float32Array =>
{
    const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    const workSpace = $getCurrentWorkSpace();
    const instance = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return matrix;
    }

    switch (instance.type) {

        case $BITMAP_TYPE:
        case $VIDEO_TYPE:
            return $getElementMaskMatrix(character);

        case $MOVIE_CLIP_TYPE:
        {
            const bounds = (instance as MovieClip)
                .getRawBounds((instance as MovieClip).currentFrame);
            if (!bounds) {
                return matrix;
            }

            return new Float32Array([1, 0, 0, 1, bounds.xMin * workSpace.scale, bounds.yMin * workSpace.scale]);
        }

        case $SHAPE_TYPE:
        {
            const concatMatrix = $getConcatenatedMatrix();
            return new Float32Array([1, 0, 0, 1, concatMatrix[4], concatMatrix[5]]);
        }

        default:
            return matrix;

    }
};