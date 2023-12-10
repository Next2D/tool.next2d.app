import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineToolLayerAddHistoryService } from "@/history/application/timeline/TimelineTool/LayerAdd/service/TimelineToolLayerAddHistoryService";

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
    timelineToolLayerAddHistoryService(layer);

    // タイムラインのレイヤーを再描画
    timelineLayerBuildElementUseCase();
};