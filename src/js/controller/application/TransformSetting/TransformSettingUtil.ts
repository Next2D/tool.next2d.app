import type { Character } from "@/core/domain/model/Character";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Matrix } from "@next2d/geom";

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
 * @description Characterの行列と親のMovieClipとスクリーンの拡大率の行列を返却
 *              Returns the matrix of the Character and the parent MovieClip and the screen magnification
 *
 * @param  {Character} character
 * @return {Float32Array}
 * @method
 * @public
 */
export const $createTransformMatrix = (character: Character): Float32Array =>
{
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = Matrix.multiply(concatenatedMatrix, character.matrix);
    const radianX = Math.atan2(matrix[1], matrix[0]);
    const radianY = Math.atan2(matrix[2], matrix[3]);
    return new Float32Array([
        Math.cos(radianX), Math.sin(radianX),
        Math.sin(radianY), Math.cos(radianY),
        0, 0
    ]);
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
    const matrix = $createTransformMatrix(character);
    return `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, 0, 0)`;
};

/**
 * @description 変形エリアのポインターの状態
 *              Pointer state of the transformation area
 *
 * @type {"up" | "down"}
 * @default "up"
 * @private
 */
let state: "up" | "down" = "up";

/**
 * @description 変形エリアのポインターの状態を取得
 *              Get the pointer state of the transformation area
 *
 * @return {"up" | "down"}
 * @method
 * @public
 */
export const $getTransformSettingState = (): "up" | "down" =>
{
    return state;
};

/**
 * @description 変形エリアのポインターの状態を設定
 *              Set the pointer state of the transformation area
 *
 * @param value "up" | "down"
 * @return {void}
 * @method
 * @public
 */
export const $setTransformSettingState = (value: "up" | "down"): void =>
{
    state = value;
};