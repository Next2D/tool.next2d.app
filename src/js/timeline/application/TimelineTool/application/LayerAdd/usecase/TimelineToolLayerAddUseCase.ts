import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";

/**
 * @description タイムラインに新規レイヤーを追加する
 *              Adding a new layer to the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scene = $getCurrentWorkSpace().scene;

    const targetLayers = timelineLayer.targetLayers;
    const targetLayer: Layer = !targetLayers.size
        ? scene.layers[0] as NonNullable<Layer>
        : scene.getLayer(targetLayers.keys().next().value) as NonNullable<Layer>;

    // レイヤーを追加
    const layer = scene.createLayer();
    const index = scene.layers.indexOf(targetLayer);
    scene.setLayer(layer, index);

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(layer);

    // タイムラインのレイヤーを再描画
    timelineLayerAddElementUseCase(layer, targetLayer);

    // 追加したレイヤーをアクティブ表示にする
    timelineLayerControllerNormalSelectUseCase(layer.id);

    const element: HTMLElement | null = document
        .getElementById(`layer-id-${layer.id}`);

    if (!element) {
        return ;
    }

    // レイヤーをアクティブに更新
    timelineLayerActiveElementService(element);
};