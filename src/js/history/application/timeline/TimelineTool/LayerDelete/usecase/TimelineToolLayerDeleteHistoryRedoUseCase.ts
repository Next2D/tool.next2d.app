import { $getCurrentWorkSpace, $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description レイヤー削除を再度実行する
 *              Execute layer deletion again.
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

    // Layerオブジェクトの内部情報から削除
    const layer = movieClip.layers[index];
    movieClip.removeLayer(layer);

    // 選択したレイヤー・フレーム Elementを初期化
    timelineLayerAllClearSelectedElementService();

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};