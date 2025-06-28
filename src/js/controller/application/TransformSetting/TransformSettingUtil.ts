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
 * @description ポインターでのスケール処理時のTransformStyleを生成
 *              Generate TransformStyle for scaling with pointer
 *
 * @param  {Character} character
 * @param  {WorkSpace} work_space
 * @param  {number} [scale_x=1]
 * @param  {number} [scale_y=1]
 * @param  {number} [rotation=0]
 * @return {string}
 * @method
 * @public
 */
export const $createMoveTransformElementStyle = (
    character: Character,
    work_space: WorkSpace,
    width: number,
    height: number,
    scale_x: number = 1,
    scale_y: number = 1,
    rotation: number = 0
): string => {

    const transform = [];
    if (scale_x !== 1) {
        transform.push(`scaleX(${scale_x})`);
    }
    if (scale_y !== 1) {
        transform.push(`scaleY(${scale_y})`);
    }

    if (rotation) {
        transform.push(`rotate(${rotation}deg)`);
    }

    if (!transform.length) {
        return "";
    }

    const instance = work_space.getLibrary(character.libraryId);
    if (!instance) {
        return "";
    }

    // 実寸の中心座標を取得
    const referenceX = width / 2;
    const referenceY = height / 2;

    // 中心点を原点に変形
    const multiMatrix = $multiplicationMatrix(
        new Float32Array([Math.abs(scale_x), 0, 0, Math.abs(scale_y), 0, 0]),
        new Float32Array([1, 0, 0, 1, -referenceX, -referenceY])
    );

    // 変形分の座標を補正
    multiMatrix[4] += referenceX;
    multiMatrix[5] += referenceY;
    transform.unshift(`translate(${-multiMatrix[4]}px, ${-multiMatrix[5]}px)`);

    return `${transform.join(" ")}`;
};

/**
 * @description TransformStyleを生成
 *              Generate TransformStyle
 *
 * @param  {Character} character
 * @param  {WorkSpace} work_space
 * @return {string}
 * @method
 * @public
 */
export const $createTransformElementStyle = (
    character: Character,
    work_space: WorkSpace
): string => {

    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = $multiplicationMatrix(concatenatedMatrix, character.matrix);

    const transform = [];
    const scaleX = characterCalcGetScaleXService(matrix);
    const scaleY = characterCalcGetScaleYService(matrix);
    if (scaleX !== 1 || scaleY !== 1) {
        transform.push(`scale(${Math.abs(scaleX)}, ${scaleY})`);
    }

    if (0 > scaleX) {
        transform.push(`rotateX(${Math.PI}rad)`);
    }

    const rotation = characterCalcGetRotationService(matrix);
    if (rotation) {
        transform.push(`rotate(${rotation}deg)`);
    }

    if (!transform.length
        && !concatenatedMatrix[4]
        && !concatenatedMatrix[5]
    ) {
        return "";
    }

    const instance = work_space.getLibrary(character.libraryId);
    if (!instance) {
        return "";
    }

    const bounds = instance.getRawBounds();
    if (!bounds) {
        return "";
    }

    // 実寸の中心座標を取得
    const referenceX = Math.abs(bounds.xMax - bounds.xMin) / 2;
    const referenceY = Math.abs(bounds.yMax - bounds.yMin) / 2;

    // 中心点を原点に変形
    const multiMatrix = $multiplicationMatrix(
        new Float32Array([Math.abs(matrix[0]), matrix[1], matrix[2], Math.abs(matrix[3]), 0, 0]),
        new Float32Array([1, 0, 0, 1, -referenceX, -referenceY])
    );

    // 変形分の座標を補正
    multiMatrix[4] += referenceX;
    multiMatrix[5] += referenceY;
    transform.unshift(`translate(${-multiMatrix[4]}px, ${-multiMatrix[5]}px)`);

    return `transform: ${transform.join(" ")}; `;
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