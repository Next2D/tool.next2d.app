import { $clamp } from "@/global/GlobalUtil";
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
    // マーカーの幅を変更
    document
        .documentElement
        .style
        .setProperty(
            "--marker-width",
            `${$clamp(width, $TIMELINE_MIN_MARKER_WIDTH_SIZE, $TIMELINE_MAX_MARKER_WIDTH_SIZE)}px`
        );
};