import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";
import { execute as timelineLayerAllClearSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllClearSelectedElementUseCase";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {string} name
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    name: string,
    color: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // 表示を初期化
    if (workSpace.active && movieClip.active) {
        timelineLayerAllClearSelectedElementUseCase();
    }

    // レイヤーを追加
    externalMovieClipCreateLayerUseCase(
        workSpace, movieClip,
        index, name, color
    );
};