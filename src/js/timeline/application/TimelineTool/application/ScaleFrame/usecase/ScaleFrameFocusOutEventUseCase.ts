import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as timelineFrameUpdateFrameWidthService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameWidthService";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as timelineMarkerUpdateWidthService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerUpdateWidthService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import {
    $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE,
    $TIMELINE_MAX_FRAME_WIDTH_SIZE,
    $TIMELINE_MIN_FRAME_WIDTH_SIZE
} from "@/config/TimelineConfig";

/**
 * @description フレームのスケール設定を更新
 *              Update frame scale setting
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState = workSpace.timelineAreaState;

    const scale = parseInt(element.value);
    if (isNaN(scale) || 0 >= scale) {
        element.value = `${Math.ceil(timelineAreaState.frameWidth / $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE * 100)}`;
        return ;
    }

    const minValue = Math.ceil($TIMELINE_MIN_FRAME_WIDTH_SIZE / $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE * 100);
    const maxValue = $TIMELINE_MAX_FRAME_WIDTH_SIZE / $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE * 100;

    const value = Math.max(minValue, Math.min(scale, maxValue));
    const width = value / 100 * $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE;

    // フレーム幅が変更されていない場合は処理を終了
    if (timelineAreaState.width === width) {
        return ;
    }

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
};