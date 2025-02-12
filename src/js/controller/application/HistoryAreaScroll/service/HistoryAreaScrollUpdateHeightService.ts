import { historyArea } from "@/controller/domain/model/HistoryArea";
import {
    $HISTORY_LIST_ID,
    $HISTORY_LIST_SCROLL_AREA_ID,
    $HISTORY_LIST_SCROLL_BAR_ID
} from "@/config/HistoryConfig";

/**
 * @description 履歴エリアのスクロールバーの高さを更新する
 *              Update the height of the history area scroll bar
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const scrollAreaElement: HTMLElement | null = document
        .getElementById($HISTORY_LIST_SCROLL_AREA_ID);

    if (!scrollAreaElement) {
        return ;
    }

    const listElement: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!listElement) {
        return ;
    }

    const scrollBarElement: HTMLElement | null = document
        .getElementById($HISTORY_LIST_SCROLL_BAR_ID);

    if (!scrollBarElement) {
        return ;
    }

    // スクロールバーの幅を算出
    historyArea.scrollScale = scrollAreaElement.clientHeight / listElement.scrollHeight;
    if (1 > historyArea.scrollScale) {

        scrollBarElement.style.display = "";
        scrollBarElement.style.top = `${Math.floor(listElement.scrollTop * historyArea.scrollScale)}px`;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--history-scroll-bar-height",
                `${Math.floor(listElement.clientHeight * historyArea.scrollScale) - 2}px`
            );

    } else {

        scrollBarElement.style.display = "none";

    }
};