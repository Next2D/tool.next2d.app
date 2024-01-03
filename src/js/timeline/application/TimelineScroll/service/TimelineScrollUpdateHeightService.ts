import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $TIMELINE_SCROLL_BAR_Y_ID } from "@/config/TimelineConfig";
import { $getScrollLimitY } from "../../TimelineUtil";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";

/**
 * @type {string}
 * @private
 */
let display: "" | "none" = "none";

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

    const clientHeight: number = timelineLayer.clientHeight;
    const stopCount: number = Math.floor(clientHeight / timelineAreaState.frameHeight);

    const scene = workSpace.scene;
    if (scene.layers.length > stopCount) {

        // スクロールバーの幅を算出
        const scale: number = clientHeight / (scene.layers.length * timelineAreaState.frameHeight);

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-height",
                `${Math.floor(clientHeight * scale) - 2}px`
            );

        // スクロール位置が見切れていたら補正
        const limitY = $getScrollLimitY();
        if (scene.scrollY > limitY) {
            // スクロールのy座標を更新
            scene.scrollY = limitY;
            timelineScrollUpdateYPositionService();
        }

        // elementを更新
        if (display === "none") {

            display = "";

            // 高さを表示
            element.style.display = "";
        }

    } else {

        // 初期値に移動
        scene.scrollY = 0;

        // elementを更新
        if (!display) {

            display = "none";

            // 非表示にしてスクロール位置を初期化
            element.style.display = "none";
        }
    }
};