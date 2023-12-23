import { $TIMELINE_CONTROLLER_BASE_ID } from "@/config/TimelineConfig";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description タイムラインのヘッダーの表示幅を更新
 *              Updated display width of timeline header
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!element) {
        return ;
    }

    // 表示幅を更新
    timelineHeader.clientWidth = element.clientWidth;
};