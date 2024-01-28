import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineToolLayerDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";
import {
    $getCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";

/**
 * @description タイムラインの指定レイヤーを削除する
 *              Deleting a specified layer of the timeline
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number = 0,
    library_id: number = -1
): void => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = work_space_id !== 0
        ? $getWorkSpace(work_space_id)
        : $getCurrentWorkSpace();

    if (!workSpace) {
        return ;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const scene: InstanceImpl<MovieClip>  = library_id === -1
        ? workSpace.scene
        : workSpace.getLibrary(library_id);

    if (!scene) {
        return ;
    }

    // 選択されたレイヤーがなければ終了
    const selectedLayers = scene.selectedLayers;
    if (!selectedLayers.length) {
        return ;
    }

    // 選択したレイヤー・フレームを解放
    // fixed logic
    timelineLayerAllClearSelectedElementService();

    let minIndex = Number.MAX_VALUE;
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];

        // 元の配列のポジションを取得
        // fixed logic
        const index = scene.layers.indexOf(layer);

        // 一番小さいポジションをセット
        minIndex = Math.min(minIndex, index);

        // 作業履歴に登録
        timelineToolLayerDeleteHistoryUseCase(
            workSpace, scene, layer, index
        );

        // レイヤー削除を実行
        scene.removeLayer(layer);
    }

    // 現時点での最小ポジション
    minIndex = Math.min(minIndex, scene.layers.length);

    const layer: Layer | undefined = scene.layers[
        minIndex > 0 ? minIndex - 1 : 0
    ];

    // 削除した近辺にレイヤーがあれば選択状にして、Elementをアクティブに更新する
    if (layer) {
        externalTimelineLayerControllerNormalSelectUseCase(
            workSpace, scene, layer, timelineFrame.currentFrame
        );
    }

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // y座標のスクロール位置を更新
    timelineScrollUpdateYPositionService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};