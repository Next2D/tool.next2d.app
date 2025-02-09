import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaMoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaMoveDisplayObjectElementService";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";

/**
 * @description DisplayObjectのy座標を変更前に戻す
 *              Reset the y coordinate of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_y
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
    before_y: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
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
    character.referencePosition.y -= character.y - before_y;

    // データを更新
    character.y = before_y;

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        // 表示Elementを移動
        screenAreaMoveDisplayObjectElementService(layer, character);

        // 選択範囲のElementを移動
        targetRectUpdateElementUseCase();

        // TransformSettingのy座標を更新
        transformSettingUpdateYElementService(character.y);
    }
};