import type { Character } from "@/core/domain/model/Character";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $createTransformElementStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
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

    const bounds = character.getRawBounds();
    if (!bounds) {
        return "";
    }

    const workSpace = $getCurrentWorkSpace();
    const x = $getScreenOffsetLeft() + character.globalMinX;
    const y = $getScreenOffsetTop()  + character.globalMinY;

    const concatenatedMatrix = $getConcatenatedMatrix();
    const scaleX = characterCalcGetScaleXService(concatenatedMatrix);
    const scaleY = characterCalcGetScaleYService(concatenatedMatrix);

    const width  = Math.ceil(Math.abs((bounds.xMax - bounds.xMin) * character.scaleX * workSpace.scale));
    const height = Math.ceil(Math.abs((bounds.yMax - bounds.yMin) * character.scaleY * workSpace.scale));

    return `<div class="display-object layer-id-${layer_id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${character.width * workSpace.scale * scaleX}px; height: ${character.height * workSpace.scale * scaleY}px; opacity: ${character.alpha};"><div class="canvas-container container-layer-id-${layer_id}" style="width: ${width}px; height: ${height}px; transform: ${$createTransformElementStyle(character)};"></div></div>`;
};