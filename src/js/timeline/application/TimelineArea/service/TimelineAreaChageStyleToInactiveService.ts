import {
    $TIMELINE_ADJUSTMENT_X_ID,
    $TIMELINE_CONTROLLER_BASE_ID
} from "../../../../config/TimelineConfig";
import { timelineHeader } from "../../TimelineUtil";

/**
 * @description タイムラインエリアを初期位置に戻す
 *              Restore the timeline area to its initial position
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // ツールエリアを初期値に移動
    element.style.borderLeft   = "";
    element.style.borderBottom = "";
    element.style.borderRight  = "";
    element.style.width        = "";
    element.style.minWidth     = "";
    element.style.left         = "";
    element.style.top          = "";
    element.style.zIndex       = "";
    element.style.boxShadow    = "";
    element.style.position     = "";

    const timelineHeight: string = document
        .documentElement
        .style
        .getPropertyValue("--timeline-logic-height");

    // ツールエリアの幅を元に戻す
    document
        .documentElement
        .style
        .setProperty("--timeline-height", timelineHeight);

    // 移動時に利用する幅の変数を初期化
    document
        .documentElement
        .style
        .setProperty("--timeline-logic-width", "0px");

    const baseElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!baseElement) {
        return ;
    }

    // 個別設定を初期化
    baseElement.style.width = "";

    // ヘッダーの幅を更新
    timelineHeader.clientWidth = baseElement.clientWidth;

    // 幅拡大Elementを非表示
    const xAdjElement: HTMLElement | null = document
        .getElementById($TIMELINE_ADJUSTMENT_X_ID);

    if (!xAdjElement) {
        return ;
    }

    xAdjElement.style.display = "none";

    // 表示分をcssに適用
    document
        .documentElement
        .style
        .setProperty("--timeline-adjustment-width", "0px");
};