import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description レイヤーエリアのy移動するスクロールの高さを更新
 *              Update y-moving scroll height in layer area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!element) {
        return ;
    }

    timelineLayer.clientHeight = element.clientHeight;
};