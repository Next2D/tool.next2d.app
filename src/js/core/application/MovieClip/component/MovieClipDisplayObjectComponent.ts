import type { Character } from "@/core/domain/model/Character";
import { Matrix } from "@next2d/geom";
import { $createTransformElementStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
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

    // 親との合成行列から、各基底ベクトルの長さを倍率として求める
    // 親と自身のスケールの掛け算では、親が非等方かつ自身に回転がある場合に一致しない
    const matrix = Matrix.multiply($getConcatenatedMatrix(), character.matrix);
    const scaleX = Math.hypot(matrix[0], matrix[1]);
    const scaleY = Math.hypot(matrix[2], matrix[3]);

    const width  = Math.ceil(Math.abs((rawBounds.xMax - rawBounds.xMin) * scaleX));
    const height = Math.ceil(Math.abs((rawBounds.yMax - rawBounds.yMin) * scaleY));

    return `<div class="display-object layer-id-${layer_id} character-id-${character.id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px; height: ${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px; --transform: ${$createTransformElementStyle(character)}; --width: ${width}px; --height: ${height}px;"><div class="canvas-container container-layer-id-${layer_id}"></div></div>`;
};