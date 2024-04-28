import { $setCursor } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameWidthService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameWidthService";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as timelineMarkerUpdateWidthService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerUpdateWidthService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import {
    $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE,
    $TIMELINE_MAX_FRAME_WIDTH_SIZE,
    $TIMELINE_MIN_FRAME_WIDTH_SIZE,
    $TIMELINE_SCROLL_ID
} from "@/config/TimelineConfig";

/**
 * @description フレームのスケール設定の値操作のマウスムーブイベント
 *              Mouse move event of value operation of frame scale setting
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    requestAnimationFrame((): void =>
    {
        const element: HTMLInputElement | null = document
            .getElementById($TIMELINE_SCROLL_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        const currentValue = parseInt(element.value);

        const minValue = Math.ceil($TIMELINE_MIN_FRAME_WIDTH_SIZE / $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE * 100);
        const maxValue = $TIMELINE_MAX_FRAME_WIDTH_SIZE / $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE * 100;

        const value = Math.max(minValue, Math.min(
            currentValue + event.movementX,
            maxValue
        ));

        if (value !== currentValue) {

            const width = value / 100 * $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE;

            // フレーム幅を更新
            timelineFrameUpdateFrameWidthService(width);

            // マーカーの幅を更新
            timelineMarkerUpdateWidthService(width);

            // マーカー位置を更新
            timelineMarkerMovePositionService();

            // ヘッダーを再描画
            timelineHeaderWindowResizeUseCase();

            // レイヤーを再描画
            timelineLayerWindowResizeUseCase();
        }
    });
};