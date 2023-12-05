import { $TIMELINE_CURRENT_FRAME_ID } from "@/config/TimelineConfig";
import { timelineFrame } from "../../TimelineUtil";

/**
 * @description タイムラインのフレーム表示を更新
 *              Updated timeline frame display
 *
 * @param {number} frame
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($TIMELINE_CURRENT_FRAME_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // 表示Elementを更新
    element.value = `${frame}`;

    // 内部情報を更新
    timelineFrame.currentFrame = frame;
};