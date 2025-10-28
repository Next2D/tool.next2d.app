import type { Character } from "@/core/domain/model/Character";
import type { IBounds } from "@/interface/IBounds";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getMatrixBounds } from "../../CoreUtil";
import { Matrix } from "@next2d/geom";

/**
 * @description matrixを適用した矩形情報を返却、取得できない場合はnullを返却
 *              Returns the rectangle information after applying the matrix; returns null if it cannot be obtained.
 *
 * @param  {Character} character
 * @param  {number} frame
 * @param  {boolean} [use_parent_matrix=false]
 * @return {IBounds | null}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    frame: number = 1,
    use_parent_matrix: boolean = false
): IBounds | null => {
    const bounds = character.getRawBounds(frame);
    return bounds ? $getMatrixBounds(
        bounds.xMin,
        bounds.yMin,
        bounds.xMax,
        bounds.yMax,
        use_parent_matrix ? Matrix.multiply($getConcatenatedMatrix(), character.matrix) : character.matrix
    ) : null;
};