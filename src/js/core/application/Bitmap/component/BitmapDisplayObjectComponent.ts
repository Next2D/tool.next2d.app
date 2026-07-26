import type { Character } from "@/core/domain/model/Character";
import { Matrix } from "@next2d/geom";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import {
    $createTransformElementStyle,
    $getConcatenatedMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description 指定されたBitmap用のdivを生成して返却
 *              Generate and return a div for the specified Bitmap
 *
 * @params {Character} character
 * @params {number} layer_id
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    layer_id: number
): string => {

    const rawBounds = character.getRawBounds();
    if (!rawBounds) {
        return "";
    }

    const bounds = character.getBounds(1, true);
    if (!bounds) {
        return "";
    }

    const x = $getScreenOffsetLeft() + Math.ceil(bounds.xMin);
    const y = $getScreenOffsetTop()  + Math.ceil(bounds.yMin);

    const matrix = Matrix.multiply($getConcatenatedMatrix(), character.matrix);
    const scaleX = Math.hypot(matrix[0], matrix[1]); // fixed logic
    const scaleY = Math.hypot(matrix[2], matrix[3]); // fixed logic
    const width  = Math.ceil(Math.abs((rawBounds.xMax - rawBounds.xMin) * scaleX));
    const height = Math.ceil(Math.abs((rawBounds.yMax - rawBounds.yMin) * scaleY));

    return `<div class="display-object layer-id-${layer_id} character-id-${character.id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px; height: ${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px; --transform: ${$createTransformElementStyle(character)}; --width: ${width}px; --height: ${height}px;"><div class="canvas-container container-layer-id-${layer_id}"></div></div>`;
};