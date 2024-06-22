import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyAreaScrollMouseDownUseCase } from "./HistoryAreaScrollMouseDownUseCase";
import { execute as historyAreaScrollWheelEventService } from "../service/HistoryAreaScrollWheelEventService";
import {
    $HISTORY_LIST_PARENT_ID,
    $HISTORY_LIST_SCROLL_BAR_ID
} from "@/config/HistoryConfig";

/**
 * @description 履歴エリアのスクロールイベントを登録
 *              Register the scroll event of the history area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scrollBarElement: HTMLElement | null = document
        .getElementById($HISTORY_LIST_SCROLL_BAR_ID);

    if (scrollBarElement) {
        // マウスダウンイベントを登録
        scrollBarElement.addEventListener(EventType.MOUSE_DOWN,
            historyAreaScrollMouseDownUseCase
        );
    }

    const parentElement: HTMLElement | null = document
        .getElementById($HISTORY_LIST_PARENT_ID);

    if (parentElement) {
        parentElement.addEventListener("wheel",
            historyAreaScrollWheelEventService,
            { "passive": false }
        );
    }
};