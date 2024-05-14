import { $createTransformStyle, $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";

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

    // 変形スタイルを生成
    const workSpace = $getCurrentWorkSpace();
    const transform = $createTransformStyle(character, workSpace);

    const matrix = $getConcatenatedMatrix(workSpace);
    const x = $getScreenOffsetLeft() + character.x * characterCalcGetScaleXService(matrix);
    const y = $getScreenOffsetTop() + character.y * characterCalcGetScaleYService(matrix);
    const alpha = character.alpha;
    const depth = character.depth;

    return `
<div class="display-object layer-id-${layer_id}" data-depth="${depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; opacity: ${alpha}; ${transform}"></div>
    `;
};