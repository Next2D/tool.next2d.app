import { $TIMELINE_REPEAT_ID } from "@/config/TimelineConfig";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description ループ設定のマウスダウンの処理関数
 *              Mouse down processing function for loop settings
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_REPEAT_ID);

    if (!element) {
        return ;
    }

    // ループフラグを反転させる
    timelineHeader.loopFlag = !timelineHeader.loopFlag;

    // 表示を更新
    element.setAttribute("class", timelineHeader.loopFlag
        ? "repeat"
        : "no-repeat"
    );
};