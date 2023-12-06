import { execute as timelineLayerBuildElementUseCase } from "./TimelineLayerBuildElementUseCase";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";

/**
 * @description タイムラインのリサイズ時の実行関数
 *              Execution function when resizing the timeline
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タイムラインの幅を再描画
    timelineLayerBuildElementUseCase();

    // スクロール幅を更新
    timelineScrollUpdateWidthService();

    // x座標を更新
    timelineScrollUpdateXPositionService();
};