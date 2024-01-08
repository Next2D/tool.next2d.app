import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";

/**
 * @description タイムラインに新規レイヤーを追加する
 *              Adding a new layer to the timeline
 *
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (name: string = ""): void =>
{
    const scene = $getCurrentWorkSpace().scene;

    const targetLayers = timelineLayer.targetLayers;
    const selectedLayer: Layer | null = !targetLayers.size
        ? scene.layers[0]
        : scene.getLayer(targetLayers.keys().next().value);

    if (!selectedLayer) {
        return ;
    }

    // レイヤーを追加
    const newLayer = scene.createLayer(name);
    const index = scene.layers.indexOf(selectedLayer);
    scene.setLayer(newLayer, index);

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(newLayer);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();

    // 追加したレイヤーをアクティブ表示にする
    timelineLayerControllerNormalSelectUseCase(newLayer.id);
};