import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $createTransformStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";

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

    // 変形スタイルを生成
    const workSpace = $getCurrentWorkSpace();
    const transform = $createTransformStyle(character);

    const x = $getScreenOffsetLeft() + character.offsetX * workSpace.scale;
    const y = $getScreenOffsetTop() + character.offsetY * workSpace.scale;
    const alpha = character.alpha;
    const depth = character.depth;

    return `
<div class="display-object layer-id-${layer_id}" data-depth="${depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; opacity: ${alpha}; ${transform}"></div>
    `;
};