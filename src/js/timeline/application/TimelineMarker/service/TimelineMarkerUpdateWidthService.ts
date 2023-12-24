import { $clamp } from "@/global/GlobalUtil";
import { timelineMarker } from "@/timeline/domain/model/TimelineMarker";
import {
    $TIMELINE_MIN_MARKER_WIDTH_SIZE,
    $TIMELINE_MAX_MARKER_WIDTH_SIZE
} from "@/config/TimelineConfig";

/**
 * @description マーカーの幅を更新
 *              Update marker width
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const execute = (width: number): void =>
{
    width = $clamp(width,
        $TIMELINE_MIN_MARKER_WIDTH_SIZE,
        $TIMELINE_MAX_MARKER_WIDTH_SIZE
    );

    // 内部情報を更新
    timelineMarker.clientWidth = width;

    // マーカーの幅を変更
    document
        .documentElement
        .style
        .setProperty(
            "--marker-width",
            `${width}px`
        );
};