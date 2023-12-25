import { $TIMELINE_SCROLL_BAR_X_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getMaxFrame } from "../../TimelineUtil";

/**
 * @description スクロールバーのx座標を更新
 *              xUpdate the width of the scrollbar to move
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCROLL_BAR_X_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    const clientWidth: number = timelineHeader.clientWidth;

    // スクロールバーの幅を算出
    const width = workSpace.timelineAreaState.frameWidth + 1;
    const scale: number = clientWidth / ($getMaxFrame() * width);

    element.style.left = `${Math.floor(scene.scrollX * scale) + 1}px`;
};