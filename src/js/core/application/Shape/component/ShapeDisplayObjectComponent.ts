import type { Character } from "@/core/domain/model/Character";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import {
    $createTransformElementStyle,
    $getConcatenatedMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";

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

    const rawBounds = character.getRawBounds();
    if (!rawBounds) {
        return "";
    }

    const bounds = character.getBounds(1, true);
    if (!bounds) {
        return "";
    }

    const concatMatrix = $getConcatenatedMatrix();

    const x = $getScreenOffsetLeft() + Math.ceil(bounds.xMin);
    const y = $getScreenOffsetTop()  + Math.ceil(bounds.yMin);

    const scaleX = characterCalcGetScaleXService(concatMatrix);
    const scaleY = characterCalcGetScaleYService(concatMatrix);

    const width  = Math.ceil(Math.abs((rawBounds.xMax - rawBounds.xMin) * character.scaleX * scaleX));
    const height = Math.ceil(Math.abs((rawBounds.yMax - rawBounds.yMin) * character.scaleY * scaleY));

    return `<div class="display-object layer-id-${layer_id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px; height: ${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px; --transform: ${$createTransformElementStyle(character)}; --width: ${width}px; --height: ${height}px;"><div class="canvas-container container-layer-id-${layer_id}"></div></div>`;
};