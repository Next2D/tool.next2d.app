import { $createTransformBitmapStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "../../CoreUtil";

/**
 * @description 指定されたBitmap用のdivを生成して返却
 *              Generate and return a div for the specified Bitmap
 *
 * @params {Character} character
 * @params {number} layer_id
 * @params {string} [mask_style=""]
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    layer_id: number,
    mask_style: string = ""
): string => {

    // 変形スタイルを生成
    const workSpace = $getCurrentWorkSpace();
    const transform = $createTransformBitmapStyle(character, workSpace);

    const x = $getScreenOffsetLeft() + character.x * workSpace.scale;
    const y = $getScreenOffsetTop() + character.y * workSpace.scale;
    const alpha = character.alpha;
    const depth = character.depth;

    return `
<div class="display-object layer-id-${layer_id}" data-depth="${depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; opacity: ${alpha}; ${mask_style} ${transform}"></div>
    `;
};