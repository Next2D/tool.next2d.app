import {
    $TIMELINE_ADJUSTMENT_X_ID,
    $TIMELINE_CONTROLLER_BASE_ID
} from "../../../../config/TimelineConfig";
import { timelineHeader } from "../../TimelineUtil";
import { execute as userTimelineAreaStateUpdateService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";
import type { UserTimelineAreaStateObjectImpl } from "../../../../interface/UserTimelineAreaStateObjectImpl";
import { execute as userTimelineAreaStateGetService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateGetService";

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

    // LocalStorageのデータを取得
    const object: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();

    // 最終位置をLocalStorageに保存
    object.state      = "move";
    object.offsetLeft = element.offsetLeft;
    object.offsetTop  = element.offsetTop;
    object.width      = element.clientWidth;
    object.height     = element.clientHeight;
    userTimelineAreaStateUpdateService(object);

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

    const style: CSSStyleDeclaration = document
        .documentElement
        .style;

    const timelineHeight: string = style.getPropertyValue("--timeline-logic-height");

    // ツールエリアの幅を元に戻す
    style.setProperty("--timeline-height", timelineHeight);

    // 移動時に利用する幅の変数を初期化
    style.setProperty("--timeline-logic-width", "0px");



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
    style.setProperty("--timeline-adjustment-width", "0px");
};