import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";

/**
 * @description 作業履歴のポジションを一つ未来に進める
 *              Advance one work history position into the future.
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

    const scene = $getCurrentWorkSpace().scene;
    const node: HTMLElement | undefined = element.children[scene.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示をアクティブに更新
    node.setAttribute("class", "");

    const historyObject: HistoryObjectImpl | undefined = scene.histories[scene.historyIndex++];
    if (!historyObject) {
        return ;
    }

    historyObject.redo();
};