import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $TIMELINE_MIN_FRAME_WIDTH_SIZE,
    $TIMELINE_MAX_FRAME_WIDTH_SIZE
} from "@/config/TimelineConfig";

/**
 * @description タイムラインのフレーム幅を更新
 *              Update timeline frame widths
 *
 * @param {number} width
 * @method
 * @public
 */
export const execute = (width: number): void =>
{
    const workSpace = $getCurrentWorkSpace();

    // フレームの幅を更新
    const timelineAreaState = workSpace.timelineAreaState;
    if ($TIMELINE_MIN_FRAME_WIDTH_SIZE > width) {
        return ;
    }

    if (width > $TIMELINE_MAX_FRAME_WIDTH_SIZE) {
        return ;
    }

    // 内部データを更新
    timelineAreaState.frameWidth = width;

    // styleの値を更新
    document
        .documentElement
        .style
        .setProperty("--timeline-frame-width", `${width}px`);
};