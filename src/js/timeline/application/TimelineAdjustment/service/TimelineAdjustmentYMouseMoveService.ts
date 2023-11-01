import { $TIMELINE_MIN_HEIGHT, $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { $getTimelineAreaState } from "../../TimelineArea/TimelineAreaUtil";
import { execute as timelineLayerBuildElementUseCase } from "../../TimelineLayer/usecase/TimelineLayerBuildElementUseCase";

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

        let height: number = parseFloat(style.getPropertyValue("--timeline-logic-height"));
        height += -event.movementY;
        style.setProperty("--timeline-logic-height", `${Math.max($TIMELINE_MIN_HEIGHT, height)}px`);

        if ($getTimelineAreaState() === "move") {
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_ID);

            if (element && $TIMELINE_MIN_HEIGHT < height) {
                element.style.top = `${element.offsetTop + event.movementY}px`;
            }
        } else {
            style.setProperty("--timeline-height", `${Math.max($TIMELINE_MIN_HEIGHT, height)}px`);
        }

        // タイムラインのレイヤーを再描画
        timelineLayerBuildElementUseCase();
    });
};