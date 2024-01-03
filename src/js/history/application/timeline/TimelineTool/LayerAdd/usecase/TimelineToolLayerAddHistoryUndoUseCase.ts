import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.removeLayer(layer);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};