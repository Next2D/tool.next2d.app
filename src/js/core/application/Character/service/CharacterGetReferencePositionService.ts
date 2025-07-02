import type { IPosition } from "@/interface/IPosition";
import type { Character } from "@/core/domain/model/Character";
import {
    $getConcatenatedMatrix,
    $multiplicationMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description 先祖からのmatrixを加算した中心点位置を返却
 *              Return the center point position added with the matrix from the ancestor
 *
 * @returns {IPosition}
 * @method
 * @public
 */
export const execute = (character: Character): IPosition =>
{
    // 先祖からのmatrixを加算
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = $multiplicationMatrix(
        concatenatedMatrix,
        character.matrix
    );

    return {
        "x": character.referencePosition.x * matrix[0] + character.referencePosition.y * matrix[2] + matrix[4],
        "y": character.referencePosition.x * matrix[1] + character.referencePosition.y * matrix[3] + matrix[5]
    };
};