import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyAddElementUseCase } from "@/history/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/history/service/HistoryGetTextService";

/**
 * @description 作業履歴のElementを全て削除して、現在プロジェクトの作業履歴を読み込む
 *              Delete all Elements in the work history and load the work history of the current project
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

    // 全てのElementを削除
    while (element.children.length) {
        element.children[0].remove();
    }

    const workSpace = $getCurrentWorkSpace();

    const histories = workSpace.histories;
    for (let idx = 0; idx < histories.length; ++idx) {
        const historyObject = histories[idx];
        historyAddElementUseCase(
            idx, historyGetTextService(historyObject.command),
            workSpace.historyIndex > idx ? "" : "disable"
        );
    }
};