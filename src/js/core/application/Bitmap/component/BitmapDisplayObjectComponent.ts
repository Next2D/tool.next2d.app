import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";

/**
 * @description 指定されたDisplayObjectのdivを生成して返却
 *              Generate and return the div of the specified DisplayObject
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

    const matrix = character.matrix;
    const x = $getScreenOffsetLeft() + character.x;
    const y = $getScreenOffsetTop()  + character.y;
    const alpha = character.alpha;
    const depth = character.depth;

    return `
<div class="display-object" data-depth="${depth}" data-layer-id="${layer_id}" style="transform: matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, 0, 0); top: ${y}px; left: ${x}px; opacity: ${alpha};"></div>
    `;
};