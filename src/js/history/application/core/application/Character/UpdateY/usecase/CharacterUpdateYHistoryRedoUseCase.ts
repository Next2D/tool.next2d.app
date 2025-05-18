import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaMoveDisplayObjectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveDisplayObjectElementUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description DisplayObjectのy座標を変更後に戻す
 *              Reset the y coordinate of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} after_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number,
    after_y: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // 中心点を移動に合わせて移動
    // fixed logic
    character.referencePosition.y += after_y - character.y;

    // データを更新
    character.y = after_y;

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        // 表示Elementを移動
        screenAreaMoveDisplayObjectElementUseCase(layer, character);

        if (movieClip.selectedDepths.size > 0) {
            // 選択範囲のElementを移動
            targetRectUpdateElementUseCase();

            // TransformSettingのy座標を更新
            const bounds = screenAreaCalcSelectedBoundsService(movieClip);
            if (bounds) {
                transformSettingUpdateYElementService(bounds.yMin);
            }
        }
    }
};