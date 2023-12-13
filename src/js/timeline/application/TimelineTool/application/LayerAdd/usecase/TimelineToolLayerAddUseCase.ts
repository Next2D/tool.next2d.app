import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";

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
    const layer = scene.addLayer();

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(layer);

    // タイムラインのレイヤーを再描画
    timelineLayerAddElementUseCase(layer, scene.layers.values().next().value);
};