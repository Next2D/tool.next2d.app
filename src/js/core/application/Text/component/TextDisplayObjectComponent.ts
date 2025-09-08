import type { Character } from "@/core/domain/model/Character";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { $getMatrixBounds } from "../../CoreUtil";
import {
    $createTransformElementStyle,
    $getConcatenatedMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
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

    const concatMatrix = $getConcatenatedMatrix();

    const x = $getScreenOffsetLeft() + character.globalMinX;
    const y = $getScreenOffsetTop()  + character.globalMinY;

    const scaleX = characterCalcGetScaleXService(concatMatrix);
    const scaleY = characterCalcGetScaleYService(concatMatrix);

    const width  = Math.ceil(Math.abs((bounds.xMax - bounds.xMin) * character.scaleX * scaleX));
    const height = Math.ceil(Math.abs((bounds.yMax - bounds.yMin) * character.scaleY * scaleY));

    const matrixBounds = $getMatrixBounds(
        0, 0,
        character.width,
        character.height,
        concatMatrix
    );

    return `<div class="display-object layer-id-${layer_id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.abs(matrixBounds.xMax - matrixBounds.xMin)}px; height: ${Math.abs(matrixBounds.yMax - matrixBounds.yMin)}px; opacity: ${character.alpha};"><div class="canvas-container container-layer-id-${layer_id}" style="width: ${width}px; height: ${height}px; transform: ${$createTransformElementStyle(character)};"></div></div>`;
};