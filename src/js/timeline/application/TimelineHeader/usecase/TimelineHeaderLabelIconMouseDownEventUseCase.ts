import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderIconRegisterWindowEventUseCase } from "./TimelineHeaderIconRegisterWindowEventUseCase";
import {
    $TIMELINE_HEADER_ICON_ID,
    $TIMELINE_MARKER_ID
} from "@/config/TimelineConfig";
import {
    $setMoveIconFrame,
    $setMoveIconType
} from "../../TimelineUtil";

/**
 * @description ラベルアイコンのマウスダウンイベントの実行関数
 *              Execution function of the mouse down event of the label icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const parentElement = element.parentElement;
    if (!parentElement) {
        return ;
    }

    const iconElement: HTMLElement | null = document
        .getElementById($TIMELINE_HEADER_ICON_ID);

    if (!iconElement) {
        return ;
    }

    // ラベルがなければ終了
    const frame = parseInt(parentElement.dataset.frame as string);
    const scene = $getCurrentWorkSpace().scene;
    if (!scene.hasLabel(frame)) {
        return ;
    }

    // マーカーのイベントを無効化
    const markerElement = document.getElementById($TIMELINE_MARKER_ID);
    if (markerElement) {
        markerElement.style.pointerEvents = "none";
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 移動するElementをセット
    let style = "display: block;";
    style += "position: fixed;";
    style += `left: ${event.pageX - element.clientWidth / 2}px;`;
    style += `top: ${event.pageY - element.clientHeight / 2}px;`;

    // setAttributeで完全に上書きする
    iconElement.setAttribute("class", "frame-border-box-marker");
    iconElement.setAttribute("style", style);

    // 移動するアイコンのタイプをセット
    $setMoveIconType("label");

    // 移動するFrameをセット
    $setMoveIconFrame(frame);

    // windwoイベント登録
    timelineHeaderIconRegisterWindowEventUseCase();
};