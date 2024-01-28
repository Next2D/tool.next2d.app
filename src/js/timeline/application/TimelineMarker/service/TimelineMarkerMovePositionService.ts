import {
    $TIMELINE_MARKER_BORDER_ID,
    $TIMELINE_MARKER_ID
} from "@/config/TimelineConfig";
import { $getLeftFrame } from "../../TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { timelineMarker } from "@/timeline/domain/model/TimelineMarker";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description Elementの表示状態
 *              Element display status
 *
 * @type {string}
 * @private
 */
let display: "" | "none" = "";

/**
 * @description マーカーの座標を移動、表示範囲になければ非表示にする
 *              Move the coordinates of the marker and hide it if it is not in the display range
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const markerElement: HTMLElement | null = document
        .getElementById($TIMELINE_MARKER_ID);

    if (!markerElement) {
        return ;
    }

    const borderElement: HTMLElement | null = document
        .getElementById($TIMELINE_MARKER_BORDER_ID);

    if (!borderElement) {
        return ;
    }

    const scene = $getCurrentWorkSpace().scene;
    const index: number = scene.currentFrame - $getLeftFrame();

    const workSpace = $getCurrentWorkSpace();
    const left = index * (workSpace.timelineAreaState.frameWidth + 1);

    if (0 > index || Math.abs(left) > timelineHeader.clientWidth) {

        if (display !== "") {
            return;
        }

        // 画面から見切れていて、表示がOnの時だけ非表示処理を行う
        display = "none";
        markerElement.style.display = "none";
        borderElement.style.display = "none";

    } else {

        // 画面内に表示されていて、表示がoffの時だけ表示処理を行う
        if (display === "none") {
            display = "";
            markerElement.style.display = "";
            borderElement.style.display = "";
        }

        markerElement.style.left = `${left}px`;

        // ボーダー位置を更新
        document
            .documentElement
            .style
            .setProperty(
                "--timeline-marker-border-left",
                `${Math.floor((timelineMarker.clientWidth - 1) / 2) + left}px`
            );
    }
};