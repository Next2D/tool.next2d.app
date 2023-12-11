import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { execute as historyRemoveElementService } from "@/history/service/HistoryRemoveElementService";

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

    // ポジション位置から先の履歴を削除
    historyRemoveElementService();

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(layer);

    // タイムラインのレイヤーを再描画
    timelineLayerBuildElementUseCase();
};