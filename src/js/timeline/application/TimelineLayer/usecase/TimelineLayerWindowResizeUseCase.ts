import { execute as timelineLayerFrameUpdateAllElementUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameUpdateAllElementUseCase";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";
import { execute as timelineHeaderUpdateClientWidthService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateClientWidthService";

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
    // 内部情報のヘッダーの幅を更新
    timelineHeaderUpdateClientWidthService();

    // スクロール幅を更新
    timelineScrollUpdateWidthService();

    // x座標を更新
    timelineScrollUpdateXPositionService();

    // フレームElementを再描画
    timelineLayerFrameUpdateAllElementUseCase();
};