import { $TIMELINE_SCROLL_BAR_Y_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description スクロールバーのy座標を更新
 *              yUpdate the width of the scrollbar to move
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCROLL_BAR_Y_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    const clientHeight: number = timelineLayer.clientHeight;

    // スクロールバーの幅を算出
    const height = workSpace.timelineAreaState.frameHeight;
    const scale: number = clientHeight / (scene.layers.length * height);

    element.style.top = `${Math.floor(scene.scrollY * scale) + 1}px`;
};