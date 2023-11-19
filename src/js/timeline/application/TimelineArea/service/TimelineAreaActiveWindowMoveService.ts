import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { $getTimelineAreaState } from "../TimelineAreaUtil";

/**
 * @description タイムラインエリアの移動処理
 *              Movement process for timeline area
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    if ($getTimelineAreaState() === "fixed") {
        event.stopPropagation();
    }

    event.preventDefault();

    // 遅延実行
    requestAnimationFrame(() =>
    {
        const element: HTMLElement | null = document
            .getElementById($TIMELINE_ID);

        if (!element) {
            return ;
        }

        // ツールエリアを移動
        element.style.left = `${element.offsetLeft + event.movementX}px`;
        element.style.top  = `${element.offsetTop  + event.movementY}px`;
    });
};