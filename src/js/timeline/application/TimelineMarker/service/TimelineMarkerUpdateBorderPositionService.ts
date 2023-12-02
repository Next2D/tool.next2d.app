import { $TIMELINE_MARKER_ID } from "@/config/TimelineConfig";

/**
 * @description タイムラインマーカーのボーダーの座標を更新
 *              Update coordinates of timeline marker borders
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element:  HTMLElement | null = document
        .getElementById($TIMELINE_MARKER_ID);

    if (!element) {
        return ;
    }

    // update
    document
        .documentElement
        .style
        .setProperty("--timeline-marker-border-left", `${(element.clientWidth - 1) / 2 + element.offsetLeft}px`);
};