import { $createTransformStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "../../CoreUtil";

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

    const x = $getScreenOffsetLeft() + character.x;
    const y = $getScreenOffsetTop()  + character.y;
    const alpha = character.alpha;
    const depth = character.depth;

    // 変形スタイルを生成
    const transform = $createTransformStyle(character, $getCurrentWorkSpace());

    return `
<div class="display-object layer-id-${layer_id}" data-depth="${depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; opacity: ${alpha}; ${transform}"></div>
    `;
};