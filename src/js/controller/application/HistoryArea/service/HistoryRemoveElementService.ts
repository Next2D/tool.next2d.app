import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 現在のポインター位置以上の履歴のElementを削除
 *              Delete historical Element above the current pointer position
 *
 * @param  {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): void =>
{
    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    const length = work_space.histories.length;
    if (work_space.historyIndex === length) {
        return ;
    }

    for (let idx = work_space.historyIndex; idx < length; ++idx) {

        const node: HTMLElement | undefined = element.lastElementChild as HTMLElement;
        if (!node) {
            continue;
        }

        node.remove();
    }
};