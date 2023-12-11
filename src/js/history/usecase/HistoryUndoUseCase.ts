import type { Layer } from "@/core/domain/model/Layer";
import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import {
    $HISTORY_LIST_ID,
    $TIMELINE_TOOL_LAYER_ADD_COMMAD
} from "@/config/HistoryConfig";

/**
 * @description 作業履歴のポジションを一つ過去に戻す
 *              Move back one position in the work history to the past.
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
    if (!workSpace.historyIndex) {
        return ;
    }

    const historyObject: HistoryObjectImpl = workSpace.histories[--workSpace.historyIndex];

    const node: HTMLElement | undefined = element.children[workSpace.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示を非アクティブにする
    node.setAttribute("class", "disable");

    switch (historyObject.command) {

        case $TIMELINE_TOOL_LAYER_ADD_COMMAD:
            timelineToolLayerAddHistoryUndoUseCase(
                historyObject.object as NonNullable<Layer>
            );
            break;

        default:
            break;

    }
};