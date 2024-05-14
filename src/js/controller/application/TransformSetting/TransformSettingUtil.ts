import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";

/**
 * @description 親のMovieClipとスクリーンの拡大率の行列を返却
 *              Returns the matrix of the parent MovieClip and the screen magnification
 *
 * @param  {WorkSpace} work_space
 * @return {array}
 * @method
 * @public
 */
export const $getConcatenatedMatrix = (work_space: WorkSpace): number[] =>
{
    const matrix = [work_space.scale, 0, 0, work_space.scale, 0, 0];
    for (let idx = 0; idx < timelineSceneList.scenes.length; idx++) {
        const id = timelineSceneList.scenes[idx];
        console.log(id);
    }
    return matrix;
};

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
    const matrix = $multiplicationMatrix($getConcatenatedMatrix(work_space), character.matrix);

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

    if (!transform.length) {
        return "";
    }

    const instance = work_space.getLibrary(character.libraryId);
    if (!instance) {
        return "";
    }

    // 実寸の中心座標を取得
    const referenceX = instance.width / 2;
    const referenceY = instance.height / 2;

    // 中心点を原点に変形
    const multiMatrix = $multiplicationMatrix(
        [matrix[0], matrix[1], matrix[2], matrix[3], 0, 0],
        [1, 0, 0, 1, -referenceX, -referenceY]
    );

    // 変形分の座標を補正
    multiMatrix[4] += referenceX;
    multiMatrix[5] += referenceY;
    transform.unshift(`translate(${-multiMatrix[4]}px, ${-multiMatrix[5]}px)`);

    return `transform: ${transform.join(" ")}; `;
};