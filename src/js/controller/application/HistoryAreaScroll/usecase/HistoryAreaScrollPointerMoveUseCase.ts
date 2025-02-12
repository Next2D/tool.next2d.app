import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { historyArea } from "@/controller/domain/model/HistoryArea";

/**
 * @description 履歴エリアのスクロールバーのマウスムーブイベント
 *              Mouse move event of the history area scroll bar
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    if (!event.movementY) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const historyAreaElement: HTMLElement | null = document
            .getElementById($HISTORY_LIST_ID);

        if (!historyAreaElement) {
            return ;
        }

        historyAreaElement.scrollTop += event.movementY * 2;
        element.style.top = `${historyAreaElement.scrollTop * historyArea.scrollScale}px`;
    });
};