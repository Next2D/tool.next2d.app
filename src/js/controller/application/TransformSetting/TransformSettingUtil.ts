import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

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
    const matrix = [];
    const scaleX = character.scaleX * work_space.scale;
    const scaleY = character.scaleY * work_space.scale;
    if (scaleX !== 1 || scaleY !== 1) {
        matrix.push(`scale(${scaleX}, ${scaleY})`);
    }
    if (character.rotation) {
        matrix.push(`rotate(${character.rotation}deg)`);
    }

    if (!matrix.length) {
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
        $multiplicationMatrix(
            [work_space.scale, 0, 0, work_space.scale, 0, 0],
            [character.matrix[0], character.matrix[1], character.matrix[2], character.matrix[3], 0, 0]
        ),
        [1, 0, 0, 1, -referenceX, -referenceY]
    );

    // 変形分の座標を補正
    multiMatrix[4] += referenceX;
    multiMatrix[5] += referenceY;
    matrix.unshift(`translate(${-multiMatrix[4]}px, ${-multiMatrix[5]}px)`);

    return `transform: ${matrix.join(" ")}; `;
};