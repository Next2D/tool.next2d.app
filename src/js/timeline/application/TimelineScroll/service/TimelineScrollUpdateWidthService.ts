import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getMaxFrame, $getScrollLimitX } from "../../TimelineUtil";

/**
 * @description x移動するスクロールバーの幅を更新
 *              xUpdate the width of the scrollbar to move
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    const clientWidth: number = timelineHeader.clientWidth;
    const frameWidth: number  = workSpace.timelineAreaState.frameWidth + 1;

    // スクロールバーの幅を算出
    const scale: number = clientWidth / ($getMaxFrame() * frameWidth);

    // 2pxはborderの1pxの上下の分
    document
        .documentElement
        .style
        .setProperty(
            "--timeline-scroll-bar-width",
            `${Math.floor(clientWidth * scale) - 2}px`
        );

    // スクロール位置が見切れていたら補正
    const limitX = $getScrollLimitX();
    if (scene.scrollX > limitX) {
        scene.scrollX = limitX;
    }
};