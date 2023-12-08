import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $FIXED_FRAME_COUNT } from "@/config/TimelineConfig";
import {
    timelineFrame,
    timelineHeader
} from "../../TimelineUtil";

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
    const totalFrame: number  = scene.totalFrame + $FIXED_FRAME_COUNT;
    const frameWidth: number  = workSpace.timelineAreaState.frameWidth;

    // スクロールバーの幅を算出
    const scale: number = clientWidth / (totalFrame * frameWidth);

    // 2pxはborderの1pxの上下の分
    document
        .documentElement
        .style
        .setProperty(
            "--timeline-scroll-bar-width",
            `${Math.floor(clientWidth * scale) - 2}px`
        );

    // スクロール位置が見切れていたら補正
    const limitX = (scene.totalFrame + $FIXED_FRAME_COUNT) * frameWidth - clientWidth;
    if (scene.scrollX > limitX) {
        scene.scrollX = limitX;
    }
};