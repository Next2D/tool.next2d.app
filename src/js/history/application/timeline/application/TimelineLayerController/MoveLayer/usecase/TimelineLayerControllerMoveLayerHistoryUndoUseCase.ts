import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

/**
 * @description レイヤーの移動を元に戻す
 *              Undo Layer Movement
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} before_index
 * @param  {number} after_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    before_index: number,
    after_index: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layers = movieClip.layers.splice(after_index, 1);
    if (!layers.length) {
        return ;
    }

    movieClip.layers.splice(before_index, 0, layers[0]);

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        timelineLayerBuildElementUseCase();
    }
};