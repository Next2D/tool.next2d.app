import { $TIMELINE_CONTROLLER_BASE_ID } from "@/config/TimelineConfig";
import { execute as timelineHeaderMenuShowService } from "../service/TimelineHeaderMenuShowService";

/**
 * @description タイムラインヘッダーのイベント登録関数
 *              Timeline header event registration functions
 *
 * @return {void}
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

    element.addEventListener("contextmenu", timelineHeaderMenuShowService);
};