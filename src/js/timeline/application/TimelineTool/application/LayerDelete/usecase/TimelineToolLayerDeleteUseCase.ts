import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementUpdateDisplayService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";
import { execute as timelineToolLayerDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUseCase";
import { execute as timelineLayerClearSelectedLayerService } from "@/timeline/application/TimelineLayer/service/TimelineLayerClearSelectedLayerService";
import { execute as timelineLayerFrameClearSelectedElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameClearSelectedElementService";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";

/**
 * @description タイムラインの指定レイヤーを削除する
 *              Deleting a specified layer of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    if (!scene.layers.length || scene.layers.length === 1) {
        return ;
    }

    const targetLayers = timelineLayer.targetLayers;
    if (!targetLayers.size) {
        return ;
    }

    let minIndex = Number.MAX_VALUE;
    for (const layerId of targetLayers.keys()) {

        const targetLayer = scene.getLayer(layerId);
        if (!targetLayer) {
            continue;
        }

        // レイヤーを非表示にする
        timelineLayerElementUpdateDisplayService(targetLayer.id, "none");

        // 元の配列のポジションを取得
        // fixed logic
        const index = scene.layers.indexOf(targetLayer);

        // 一番小さいポジションをセット
        minIndex = Math.min(minIndex, index);

        // 作業履歴に登録
        timelineToolLayerDeleteHistoryUseCase(targetLayer, index);

        // レイヤー削除を実行
        scene.removeLayer(targetLayer);
    }

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // y座標のスクロール位置を更新
    timelineScrollUpdateYPositionService();

    // タイムラインを再描画
    // timelineLayerBuildElementUseCase();

    // 選択したフレームを解放
    timelineLayerFrameClearSelectedElementService();

    // 選択したレイヤーを解放
    timelineLayerClearSelectedLayerService();

    // 現時点での最小ポジション
    minIndex = Math.min(minIndex, scene.layers.length);

    const layer: Layer | undefined = scene.layers[
        minIndex > 0 ? minIndex - 1 : 0
    ];
    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-id-${layer.id}`);

    if (!element) {
        return ;
    }

    // 削除した近辺にレイヤーがあれば選択状にして、Elementをアクティブに更新する
    timelineLayerControllerNormalSelectUseCase(layer.id);
    timelineLayerActiveElementService(element);
};