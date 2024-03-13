import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

/**
 * @description レイヤーの削除時のタイムライン再描画のユースケース
 *              Use case for redrawing the timeline when deleting a layer
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // y座標のスクロール位置を更新
    timelineScrollUpdateYPositionService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};