import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインのフレームの高さを更新
 *              Update timeline frame height
 *
 * @param {number} height
 * @method
 * @public
 */
export const execute = (height: number): void =>
{
    const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;

    // 内部データを更新
    timelineAreaState.frameHeight = height;

    // styleの値を更新
    document
        .documentElement
        .style
        .setProperty("--timeline-frame-height", `${height}px`);
};