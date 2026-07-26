import type { Character } from "@/core/domain/model/Character";
import { $createTransformElementStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
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
 * @params {number} current_frame
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    layer_id: number,
    current_frame: number
): string => {

    const rawBounds = character.getRawBounds(current_frame);
    if (!rawBounds) {
        return "";
    }

    const bounds = character.getBounds(current_frame, true);
    if (!bounds) {
        return "";
    }

    const x = $getScreenOffsetLeft() + Math.ceil(bounds.xMin);
    const y = $getScreenOffsetTop()  + Math.ceil(bounds.yMin);

    return `<div class="display-object layer-id-${layer_id} character-id-${character.id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px; height: ${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px; --transform: ${$createTransformElementStyle(character)};"><div class="canvas-container container-layer-id-${layer_id}"></div></div>`;
};