import {
    $TIMELINE_ADJUSTMENT_X_ID,
    $TIMELINE_CONTROLLER_BASE_ID,
    $TIMELINE_MIN_WIDTH
} from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインエリアを移動可能な状態にする
 *              Make the timeline area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const propertyAreaState = workSpace.propertyAreaState;

    const style: CSSStyleDeclaration = document
        .documentElement
        .style;

    // タイムラインエリアの高さを0にしてscreenの幅を広くする
    style.setProperty("--timeline-height", "0px");

    // タイムラインエリアのstyleを変更
    element.style.left         = `${propertyAreaState.offsetLeft}px`;
    element.style.top          = `${propertyAreaState.offsetTop}px`;
    element.style.borderLeft   = "1px solid #1c1c1c";
    element.style.borderBottom = "1px solid #1c1c1c";
    element.style.borderRight  = "1px solid #1c1c1c";
    element.style.zIndex       = `${0xffffff}`;
    element.style.boxShadow    = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position     = "fixed"; // fixed logic
};