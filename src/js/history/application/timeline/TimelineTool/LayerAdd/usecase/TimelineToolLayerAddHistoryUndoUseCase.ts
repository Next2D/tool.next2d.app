import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    // 選択中のレイヤー・フレーム Elementを初期化
    if (workSpace.active && movieClip.active) {
        timelineLayerAllClearSelectedElementService();
    }

    // Layerオブジェクトの内部情報から削除
    movieClip.removeLayer(layer);

    if (workSpace.active && movieClip.active) {
        // fixed logic
        movieClip.clearSelectedLayer();

        // タイムラインのyスクロールの高さを更新
        timelineScrollUpdateHeightService();

        // タイムラインを再描画
        timelineLayerBuildElementUseCase();
    }
};