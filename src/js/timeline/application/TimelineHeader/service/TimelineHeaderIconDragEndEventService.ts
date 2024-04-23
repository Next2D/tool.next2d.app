import { $TIMELINE_MARKER_ID } from "@/config/TimelineConfig";
import {
    $setMoveIconFrame,
    $setMoveIconType
} from "../../TimelineUtil";

/**
 * @description スクリプトアイコンのドラッグ終了イベントの実行関数
 *              Execution function of the drag end event of the script icon
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 移動変数を初期化
    $setMoveIconType("");
    $setMoveIconFrame(0);

    // マーカーのイベントを有効化
    const markerElement = document.getElementById($TIMELINE_MARKER_ID);
    if (markerElement) {
        markerElement.style.pointerEvents = "";
    }

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // ドラッグを無効化
    element.draggable = false;
};