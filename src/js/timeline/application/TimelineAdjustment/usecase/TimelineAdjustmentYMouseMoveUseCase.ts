import { $TIMELINE_MIN_HEIGHT, $TIMELINE_ID } from "@/config/TimelineConfig";
import { execute as timelineLayerBuildElementUseCase } from "../../TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerUpdateClientHeightService } from "@/timeline/application/TimelineLayer/service/TimelineLayerUpdateClientHeightService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

        const workSpace = $getCurrentWorkSpace();
        const name = workSpace.timelineAreaState.state === "move"
            ? "--timeline-logic-height"
            : "--timeline-height";

        let height: number = parseFloat(style.getPropertyValue(name));
        height += -event.movementY;
        height = Math.max($TIMELINE_MIN_HEIGHT, height);

        if (workSpace.timelineAreaState.state === "move") {

            const element: HTMLElement | null = document
                .getElementById($TIMELINE_ID);

            if (element && $TIMELINE_MIN_HEIGHT < height) {
                const offsetTop = element.offsetTop + event.movementY;
                workSpace.timelineAreaState.offsetTop = offsetTop;
                element.style.top = `${offsetTop}px`;
            }

        } else {
            style.setProperty("--timeline-height", `${height}px`);
        }

        // 高さを更新
        workSpace.timelineAreaState.height = height;
        style.setProperty("--timeline-logic-height", `${height}px`);

        // タイムエリアの高さを更新
        timelineLayerUpdateClientHeightService();

        // TODO レイヤーエリアを再描画

        // タイムラインのレイヤーを再描画
        timelineLayerBuildElementUseCase();
    });
};