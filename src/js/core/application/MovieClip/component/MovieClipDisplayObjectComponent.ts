import type { Character } from "@/core/domain/model/Character";
import { $createTransformElementStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

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

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const bounds = character.getBounds(movieClip.currentFrame, true);
    if (!bounds) {
        return "";
    }

    const x = $getScreenOffsetLeft() + Math.ceil(bounds.xMin);
    const y = $getScreenOffsetTop()  + Math.ceil(bounds.yMin);

    const concatMatrix = $getConcatenatedMatrix();
    const scaleX = characterCalcGetScaleXService(concatMatrix);
    const scaleY = characterCalcGetScaleYService(concatMatrix);

    const width  = Math.ceil(Math.abs((rawBounds.xMax - rawBounds.xMin) * character.scaleX * scaleX));
    const height = Math.ceil(Math.abs((rawBounds.yMax - rawBounds.yMin) * character.scaleY * scaleY));

    return `<div class="display-object layer-id-${layer_id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px; height: ${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px; opacity: ${character.alpha};"><div class="canvas-container container-layer-id-${layer_id}" style="width: ${width}px; height: ${height}px; transform: ${$createTransformElementStyle(character)};"></div></div>`;
};