import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaMoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaMoveDisplayObjectElementService";
import { execute as screenAreaMoveTargetRectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveTargetRectElementUseCase";

/**
 * @description DisplayObjectのx座標を変更前に戻す
 *              Reset the x coordinate of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_x
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
    before_x: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
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

    // データを更新
    character.x = before_x;

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        // 表示Elementを移動
        screenAreaMoveDisplayObjectElementService(layer, character);

        // 選択範囲のElementを移動
        screenAreaMoveTargetRectElementUseCase(movieClip);
    }
};