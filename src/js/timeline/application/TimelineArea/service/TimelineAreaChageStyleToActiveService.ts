import {
    $TIMELINE_ADJUSTMENT_X_ID,
    $TIMELINE_CONTROLLER_BASE_ID
} from "../../../../config/TimelineConfig";
import { timelineHeader } from "../../TimelineUtil";
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
    // タイムラインエリアの高さを0にしてscreenの幅を広くする
    document
        .documentElement
        .style
        .setProperty("--timeline-height", "0px");

    // ツールエリアのstyleを変更
    element.style.borderLeft   = "1px solid #1c1c1c";
    element.style.borderBottom = "1px solid #1c1c1c";
    element.style.borderRight  = "1px solid #1c1c1c";
    element.style.minWidth     = "860px";
    element.style.left         = `${element.offsetLeft}px`;
    element.style.top          = `${element.offsetTop}px`;
    element.style.zIndex       = `${0xffffff}`;
    element.style.boxShadow    = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position     = "fixed"; // fixed logic

    // 移動時に現在の幅のセット
    document
        .documentElement
        .style
        .setProperty("--timeline-logic-width", `${element.clientWidth}px`);

    // styleの幅も更新
    element.style.width = "var(--timeline-logic-width)";

    // 幅拡大Elementを表示
    const xAdjElement: HTMLElement | null = document
        .getElementById($TIMELINE_ADJUSTMENT_X_ID);

    if (!xAdjElement) {
        return ;
    }

    xAdjElement.style.display = "";

    // 表示分をcssに適用
    document
        .documentElement
        .style
        .setProperty("--timeline-adjustment-width", "8px");

    const baseElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!baseElement) {
        return ;
    }

    // ヘッダー描画範囲の幅を変更して、計算用のclientWidthを更新
    baseElement.style.width = "calc(var(--timeline-logic-width) - var(--timeline-layer-controller-width) - var(--timeline-adjustment-width))";
    timelineHeader.clientWidth = baseElement.clientWidth;
};