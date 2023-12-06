import { $TIMELINE_MIN_WIDTH } from "@/config/TimelineConfig";
import { execute as timelineHeaderWindowResizeUseCase } from "../../TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "../../TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインの幅を調整
 *              Adjust the width of the timeline
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

        let width: number = parseFloat(style.getPropertyValue("--timeline-logic-width"));
        width += event.movementX;
        width = Math.max($TIMELINE_MIN_WIDTH, width);
        style.setProperty("--timeline-logic-width", `${width}px`);

        const workSpace = $getCurrentWorkSpace();
        workSpace.timelineAreaState.width = width;

        // タイムラインのヘッダーをリサイズ
        timelineHeaderWindowResizeUseCase();

        // タイムラインのレイヤーエリアをリサイズ
        timelineLayerWindowResizeUseCase();
    });
};