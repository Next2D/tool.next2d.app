import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyRedoUseCase } from "./HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "./HistoryUndoUseCase";

/**
 * @description 指定のIndexまで作業履歴を更新する
 *              Update work history to specified Index
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    const index: number = parseInt(element.dataset.index as string);

    const workSpace = $getCurrentWorkSpace();
    if (workSpace.historyIndex > index) {
        while (workSpace.historyIndex !== index) {
            historyUndoUseCase();
        }
    } else {
        while (workSpace.historyIndex !== index) {
            historyRedoUseCase();
        }
    }
};