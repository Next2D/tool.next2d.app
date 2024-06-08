import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderIconRegisterWindowEventUseCase } from "./TimelineHeaderIconRegisteWindowEventUseCase";
import {
    $TIMELINE_HEADER_ICON_ID,
    $TIMELINE_MARKER_ID
} from "@/config/TimelineConfig";
import {
    $setDestIconFrame,
    $setMoveIconFrame,
    $setMoveIconType
} from "../../TimelineUtil";

/**
 * @description サウンドアイコンのマウスダウンイベントの実行関数
 *              Execution function of the mouse down event of the sound icon
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

    // サウンドがなければ終了
    const frame = parseInt(parentElement.dataset.frame as string);
    const scene = $getCurrentWorkSpace().scene;
    if (!scene.hasSound(frame)) {
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
    iconElement.setAttribute("class", "frame-border-box-sound");
    iconElement.setAttribute("style", style);

    // 移動するアイコンのタイプをセット
    $setMoveIconType("sound");

    // 移動するFrameをセット
    $setMoveIconFrame(frame);

    // 移動先をリセット
    $setDestIconFrame(frame);

    // windwoイベント登録
    timelineHeaderIconRegisterWindowEventUseCase();
};