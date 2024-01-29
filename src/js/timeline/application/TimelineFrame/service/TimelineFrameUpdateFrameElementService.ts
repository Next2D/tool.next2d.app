import { $TIMELINE_CURRENT_FRAME_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

    // 現在、表示中にMovieClipのフレームも更新
    $getCurrentWorkSpace()
        .scene
        .currentFrame = frame;
};