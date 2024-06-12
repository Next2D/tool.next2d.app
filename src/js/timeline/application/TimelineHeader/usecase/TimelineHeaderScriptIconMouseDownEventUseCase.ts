import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderIconRegistePointerEventUseCase } from "./TimelineHeaderIconRegistePointerEventUseCase";
import {
    $setDestIconFrame,
    $setIconClientY,
    $setMoveIconFrame,
    $setMoveIconType
} from "../../TimelineUtil";
import {
    $TIMELINE_MARKER_ID
} from "@/config/TimelineConfig";

/**
 * @description スクリプトアイコンのマウスダウンイベントの実行関数
 *              Execution function of the mouse down event of the script icon
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

    // 選択したelementからframeを取得
    let frameData: string | undefined = element.dataset.frame as string;
    if (!frameData) {
        const parentElement = element.parentElement as HTMLElement;
        if (parentElement) {
            frameData = parentElement.dataset.frame as string;
        }

        if (!frameData) {
            return ;
        }
    }

    // スクリプトがなければ終了
    const frame = parseInt(frameData);
    const scene = $getCurrentWorkSpace().scene;
    if (!scene.hasAction(frame)) {
        return ;
    }

    // マーカーのイベントを無効化
    const markerElement = document.getElementById($TIMELINE_MARKER_ID);
    if (!markerElement) {
        return ;
    }
    markerElement.style.pointerEvents = "none";

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 移動するアイコンのタイプをセット
    $setMoveIconType("script");

    // 移動するFrameをセット
    $setMoveIconFrame(frame);

    // 移動先をリセット
    $setDestIconFrame(frame);

    // y座標をセット
    $setIconClientY(event.clientY);

    // 移動イベント登録
    timelineHeaderIconRegistePointerEventUseCase(event);
};