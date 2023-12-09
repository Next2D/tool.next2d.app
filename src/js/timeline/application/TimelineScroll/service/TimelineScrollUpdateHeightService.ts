import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "../../TimelineUtil";
import { $TIMELINE_SCROLL_BAR_Y_ID } from "@/config/TimelineConfig";

/**
 * @description y移動するスクロールバーの高さを更新
 *              yUpdate height of moving scrollbar
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
    const timelineAreaState = workSpace.timelineAreaState;
    const stopCount: number = Math.floor(timelineLayer.clientHeight / timelineAreaState.frameHeight);

    const scene = workSpace.scene;
    if (scene.layers.size > stopCount) {

        // 最小表示の高さ
        const minHeight = Math.floor(stopCount * timelineAreaState.frameHeight);

        // 最小表示の時の余白の高さ
        const spaceHeight = timelineLayer.clientHeight - minHeight;

        // スクロールバーの高さを算出
        const scale  = timelineLayer.clientHeight / (scene.layers.size * timelineAreaState.frameHeight);
        const height = Math.floor((timelineLayer.clientHeight - spaceHeight) * scale);

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-height",
                `${height - 2}px`
            );

        // 高さを表示
        element.style.display = "";

    } else {
        // 非表示にしてスクロール位置を初期化
        element.style.display = "none";
        scene.scrollY = 0;
    }
};