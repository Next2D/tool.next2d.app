import { $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerUpdateClientHeightService } from "@/timeline/application/TimelineLayer/service/TimelineLayerUpdateClientHeightService";
import { execute as timelineFrameUpdateFrameHeightService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameHeightService";
import { execute as timelineLayerShowAndHideElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerShowAndHideElementUseCase";

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

    // タイムラインのレイヤーの高さを変更
    const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;
    timelineAreaState.frameHeight = $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE * parseFloat(element.value);

    // タイムラインの高さを更新
    timelineFrameUpdateFrameHeightService(timelineAreaState.frameHeight);

    // タイムラインの高さを再取得
    timelineLayerUpdateClientHeightService();

    // タイムラインの高さ変更に合わせて非表示のElementを再描画
    timelineLayerShowAndHideElementUseCase();
};