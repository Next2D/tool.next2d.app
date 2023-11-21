import { $TIMELINE_MIN_HEIGHT, $TIMELINE_ID } from "@/config/TimelineConfig";
import { execute as timelineLayerBuildElementUseCase } from "../../TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
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

        let height: number = parseFloat(style.getPropertyValue("--timeline-logic-height"));
        height += -event.movementY;
        height = Math.max($TIMELINE_MIN_HEIGHT, height);
        style.setProperty("--timeline-logic-height", `${height}px`);

        const workSpace = $getCurrentWorkSpace();
        workSpace.timelineAreaState.height = height;
        if (workSpace.timelineAreaState.state === "move") {

            const element: HTMLElement | null = document
                .getElementById($TIMELINE_ID);

            if (element && $TIMELINE_MIN_HEIGHT < height) {
                element.style.top = `${element.offsetTop + event.movementY}px`;
            }

        } else {
            style.setProperty("--timeline-height", `${height}px`);
        }

        // タイムラインのレイヤーを再描画
        timelineLayerBuildElementUseCase();
    });
};