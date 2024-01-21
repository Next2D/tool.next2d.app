import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineToolLayerDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUseCase";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import {
    $getCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";

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
    const targetLayers = timelineLayer.targetLayers;
    if (!targetLayers.size) {
        return ;
    }

    let minIndex = Number.MAX_VALUE;
    for (const layer of targetLayers.keys()) {

        // 元の配列のポジションを取得
        // fixed logic
        const index = scene.layers.indexOf(layer);

        // 一番小さいポジションをセット
        minIndex = Math.min(minIndex, index);

        // 作業履歴に登録
        timelineToolLayerDeleteHistoryUseCase(scene, layer, index);

        // レイヤー削除を実行
        scene.removeLayer(layer);
    }

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // y座標のスクロール位置を更新
    timelineScrollUpdateYPositionService();

    // 選択したレイヤー・フレームを解放
    timelineLayerAllClearSelectedElementService();

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();

    // 現時点での最小ポジション
    minIndex = Math.min(minIndex, scene.layers.length);

    const layer: Layer | undefined = scene.layers[
        minIndex > 0 ? minIndex - 1 : 0
    ];
    if (!layer) {
        return ;
    }

    // 削除した近辺にレイヤーがあれば選択状にして、Elementをアクティブに更新する
    timelineLayerControllerNormalSelectUseCase(layer);
};