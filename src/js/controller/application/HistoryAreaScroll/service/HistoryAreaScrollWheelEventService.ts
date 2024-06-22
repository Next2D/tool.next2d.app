import {
    $HISTORY_LIST_ID,
    $HISTORY_LIST_SCROLL_BAR_ID
} from "@/config/HistoryConfig";
import { historyArea } from "@/controller/domain/model/HistoryArea";

/**
 * @description 履歴エリアのホイールイベント
 *              Wheel event of the history area
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const historyAreaElement: HTMLElement | null = document
            .getElementById($HISTORY_LIST_ID);

        if (!historyAreaElement) {
            return ;
        }

        const scrollBarElement: HTMLElement | null = document
            .getElementById($HISTORY_LIST_SCROLL_BAR_ID);

        if (!scrollBarElement) {
            return ;
        }

        historyAreaElement.scrollTop += event.deltaY;
        scrollBarElement.style.top = `${historyAreaElement.scrollTop * historyArea.scrollScale}px`;
    });
};