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
    if (!event.movementY) {
        return ;
    }

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const historyAreaElement: HTMLElement | null = document
            .getElementById($HISTORY_LIST_ID);

        if (!historyAreaElement) {
            return ;
        }

        historyAreaElement.scrollTop += event.movementY / historyArea.scrollScale;
        element.style.top = `${historyAreaElement.scrollTop * historyArea.scrollScale}px`;
    });
};