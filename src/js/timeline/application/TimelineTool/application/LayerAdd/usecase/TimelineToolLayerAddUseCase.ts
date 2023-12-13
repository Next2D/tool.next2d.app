import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import type { Layer } from "@/core/domain/model/Layer";

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

    const targetLayer: Layer = !scene.selectedLayerIds.length
        ? scene.layers[0] as NonNullable<Layer>
        : scene.getLayer(scene.selectedLayerIds[0]) as NonNullable<Layer>;

    // レイヤーを追加
    const layer = scene.createLayer();

    if (!scene.selectedLayerIds.length) {
        // 先頭に追加
        scene.setLayer(layer, 0);
    } else {
        // 選択中のレイヤーの上位にセット
        const selectedLayerId = scene.selectedLayerIds[0];
        const index = scene.layers.indexOf(scene.getLayer(selectedLayerId) as NonNullable<Layer>);
        scene.setLayer(layer, index);
    }

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(layer);

    // タイムラインのレイヤーを再描画
    timelineLayerAddElementUseCase(layer, targetLayer);
};