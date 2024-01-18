import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerUpdateClientHeightService } from "@/timeline/application/TimelineLayer/service/TimelineLayerUpdateClientHeightService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import {
    $TIMELINE_MIN_HEIGHT,
    $TIMELINE_ID
} from "@/config/TimelineConfig";

/**
 * @description タイムラインの高さを調整
 *              Adjust the height of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const style: CSSStyleDeclaration = document
            .documentElement
            .style;

        const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;
        const name = timelineAreaState.state === "move"
            ? "--timeline-logic-height"
            : "--timeline-height";

        let height: number = parseFloat(style.getPropertyValue(name));
        height += -event.movementY;
        height = Math.max($TIMELINE_MIN_HEIGHT, height);

        if (timelineAreaState.state === "move") {

            const element: HTMLElement | null = document
                .getElementById($TIMELINE_ID);

            if (element && $TIMELINE_MIN_HEIGHT < height) {
                const offsetTop = element.offsetTop + event.movementY;
                timelineAreaState.offsetTop = offsetTop;
                element.style.top = `${offsetTop}px`;
            }

        } else {
            style.setProperty("--timeline-height", `${height}px`);
        }

        // 高さを更新
        timelineAreaState.height = height;
        style.setProperty("--timeline-logic-height", `${height}px`);

        // タイムエリアの高さを更新
        // fixed logic
        timelineLayerUpdateClientHeightService();

        // タイムラインのスクロールの高さを更新
        timelineScrollUpdateHeightService();

        // スクロールのy座標の更新
        timelineScrollUpdateYPositionService();

        // 表示数に変化があればタイムラインを再描画
        const afterCount = Math.floor(timelineLayer.clientHeight / timelineAreaState.frameHeight);
        if (afterCount > timelineLayer.numberOfDisplays) {
            timelineLayerBuildElementUseCase();
        }
    });
};