import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 現在のポインター位置以上の履歴を削除
 *              Delete history above the current pointer position
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const length = workSpace.histories.length;
    if (workSpace.historyIndex === length) {
        return ;
    }

    for (let idx = workSpace.historyIndex; idx < length; ++idx) {

        const node: HTMLElement | undefined = element.lastElementChild as HTMLElement;
        if (!node) {
            continue;
        }

        node.remove();
    }
};