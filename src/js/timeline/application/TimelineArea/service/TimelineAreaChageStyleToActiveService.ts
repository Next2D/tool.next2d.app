import { $TIMELINE_CONTROLLER_BASE_ID } from "../../../../config/TimelineConfig";
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
    element.style.minWidth  = "860px";
    element.style.left      = `${element.offsetLeft}px`;
    element.style.top       = `${element.offsetTop}px`;
    element.style.zIndex    = `${0xffffff}`;
    element.style.boxShadow = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position  = "fixed"; // fixed logic

    // 移動時に現在の幅のセット
    document
        .documentElement
        .style
        .setProperty("--timeline-logic-width", `${element.clientWidth}px`);

    // styleの幅も更新
    element.style.width = "calc(var(--timeline-logic-width) - var(--timeline-layer-controller-width))";

    const baseElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!baseElement) {
        return ;
    }

    // ヘッダー描画範囲の幅を変更して、計算用のclientWidthを更新
    baseElement.style.width = "calc(var(--timeline-logic-width) - var(--timeline-layer-controller-width))";
    timelineHeader.clientWidth = baseElement.clientWidth;
    console.log("koko: ", baseElement.style.width);
};