import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE,
    $SHAPE_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description 行列の掛け算
 *              Matrix multiplication
 *
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Float32Array}
 * @method
 * @static
 */
export const $multiplicationMatrix = (a: Float32Array, b: Float32Array): Float32Array =>
{
    return new Float32Array([
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    ]);
};

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

        const multiMatrix = $multiplicationMatrix(matrix, character.matrix);
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
export const $createTransformStyle = (character: Character): string =>
{
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = $multiplicationMatrix(concatenatedMatrix, character.matrix);

    const transform = [];

    const rotation = characterCalcGetRotationService(matrix);
    if (rotation) {
        transform.push(`rotate(${rotation}deg)`);
    }

    if (!transform.length) {
        return "";
    }

    return `transform: ${transform.join(" ")}; `;
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
    const matrix = $multiplicationMatrix(concatenatedMatrix, character.matrix);
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
    const multiMatrix = $multiplicationMatrix(concatenatedMatrix, character.matrix);

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