import { $TIMELINE_MIN_WIDTH } from "@/config/TimelineConfig";
import { execute as timelineHeaderUpdateClientWidthService } from "../../TimelineHeader/service/TimelineHeaderUpdateClientWidthService";
import { execute as timelineHeaderBuildElementUseCase } from "../../TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "../../TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineScrollUpdateWidthService } from "../../TimelineScroll/service/TimelineScrollUpdateWidthService";
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

        // タイムラインのヘッダー幅を更新
        timelineHeaderUpdateClientWidthService();

        // タイムラインのヘッダーを再描画
        timelineHeaderBuildElementUseCase();

        // タイムラインのレイヤーを再描画
        timelineLayerBuildElementUseCase();

        // x移動するスクロールバーの幅を更新
        timelineScrollUpdateWidthService();
    });
};