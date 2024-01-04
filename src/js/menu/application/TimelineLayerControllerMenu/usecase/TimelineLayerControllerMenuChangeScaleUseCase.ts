import { $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineFrameUpdateFrameHeightService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameHeightService";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description タイムラインコントローラーメニューの高さ変更の処理関数
 *              Processing function for changing the height of the timeline controller menu
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLSelectElement | null = event.target as HTMLSelectElement;
    if (!element) {
        return ;
    }

    const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;
    const beforeCount = Math.ceil(timelineLayer.clientHeight / timelineAreaState.frameHeight);

    // タイムラインの高さを更新
    timelineFrameUpdateFrameHeightService(
        $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE * parseFloat(element.value)
    );

    // y移動するスクロールの高さを再計算
    timelineScrollUpdateHeightService();

    // 表示数に変化があればタイムラインを再描画
    const afterCount = Math.ceil(timelineLayer.clientHeight / timelineAreaState.frameHeight);
    if (beforeCount !== afterCount) {
        timelineLayerBuildElementUseCase();
    }
};