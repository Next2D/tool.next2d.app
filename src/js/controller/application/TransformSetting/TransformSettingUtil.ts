import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 行列の掛け算
 *              Matrix multiplication
 *
 * @param  {qrray} a
 * @param  {qrray} b
 * @return {qrray}
 * @method
 * @static
 */
export const $multiplicationMatrix = (a: number[], b: number[]): number[] =>
{
    return [
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    ];
};

/**
 * @description 親のMovieClipとスクリーンの拡大率の行列を返却
 *              Returns the matrix of the parent MovieClip and the screen magnification
 *
 * @return {array}
 * @method
 * @public
 */
export const $getConcatenatedMatrix = (): number[] =>
{
    const workSpace = $getCurrentWorkSpace();

    let matrix = [workSpace.scale, 0, 0, workSpace.scale, 0, 0];
    for (let idx = 0; idx < timelineSceneList.parents.length; idx++) {

        const parentObject = timelineSceneList.parents[idx];
        if (!parentObject) {
            continue;
        }

        const character = parentObject.selectCharacter;
        if (!character) {
            continue;
        }

        matrix = $multiplicationMatrix(matrix, character.matrix);
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
export const $createTransformStyle = (character: Character, work_space: WorkSpace): string =>
{
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = $multiplicationMatrix(concatenatedMatrix, character.matrix);

    const transform = [];
    const scaleX = characterCalcGetScaleXService(matrix);
    const scaleY = characterCalcGetScaleYService(matrix);
    if (scaleX !== 1 || scaleY !== 1) {
        transform.push(`scale(${scaleX}, ${scaleY})`);
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
        [matrix[0], matrix[1], matrix[2], matrix[3], 0, 0],
        [1, 0, 0, 1, -referenceX, -referenceY]
    );

    // 変形分の座標を補正
    multiMatrix[4] += referenceX - concatenatedMatrix[4];
    multiMatrix[5] += referenceY - concatenatedMatrix[5];
    transform.unshift(`translate(${-multiMatrix[4]}px, ${-multiMatrix[5]}px)`);

    return `transform: ${transform.join(" ")}; `;
};