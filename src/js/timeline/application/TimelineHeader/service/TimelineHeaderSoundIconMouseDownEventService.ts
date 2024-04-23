import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $TIMELINE_MARKER_ID } from "@/config/TimelineConfig";
import {
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

    // ドラッグ可能にする
    element.draggable = true;

    // 移動するアイコンのタイプをセット
    $setMoveIconType("sound");

    // 移動するFrameをセット
    $setMoveIconFrame(frame);
};