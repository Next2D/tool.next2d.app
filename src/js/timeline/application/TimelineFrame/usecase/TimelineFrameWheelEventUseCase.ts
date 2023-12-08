import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $TIMELINE_MIN_FRAME_WIDTH_SIZE,
    $TIMELINE_MAX_FRAME_WIDTH_SIZE
} from "@/config/TimelineConfig";
import { execute as timelineFrameUpdateFrameWidthService } from "../service/TimelineFrameUpdateFrameWidthService";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

/**
 * @description フレーム幅のホイールイベント処理関数
 *              Frame width wheel event processing function
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    const deltaY = event.deltaY;
    if (!deltaY) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const workSpace = $getCurrentWorkSpace();

        // フレームの幅を更新
        const timelineAreaState = workSpace.timelineAreaState;
        if ($TIMELINE_MIN_FRAME_WIDTH_SIZE > timelineAreaState.frameWidth + deltaY) {
            return ;
        }

        if (timelineAreaState.frameWidth + deltaY > $TIMELINE_MAX_FRAME_WIDTH_SIZE) {
            return ;
        }

        //  フレーム幅を更新
        timelineFrameUpdateFrameWidthService(timelineAreaState.frameWidth + deltaY);

        // ヘッダーを再描画
        timelineHeaderBuildElementUseCase();

        // レイヤーを再描画
        timelineLayerBuildElementUseCase();
    });
};