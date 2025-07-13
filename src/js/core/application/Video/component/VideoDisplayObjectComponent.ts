import { $createTransformElementStyle } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { Character } from "@/core/domain/model/Character";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";

/**
 * @description 指定されたVideo用のdivを生成して返却
 *              Generate and return a div for the specified Video
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
    const transform = $createTransformElementStyle(character);

    const x = $getScreenOffsetLeft() + character.globalMinX;
    const y = $getScreenOffsetTop()  + character.globalMinY;

    return `<div class="display-object layer-id-${layer_id}" data-depth="${character.depth}" data-layer-id="${layer_id}" style="left: ${x}px; top: ${y}px; width: ${character.width}px; height: ${character.height}px; opacity: ${character.alpha}; ${transform}"></div>`;
};