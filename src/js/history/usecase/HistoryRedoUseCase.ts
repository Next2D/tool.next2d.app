import type { Layer } from "@/core/domain/model/Layer";
import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import {
    $HISTORY_LIST_ID,
    $TIMELINE_TOOL_LAYER_ADD_COMMAD
} from "@/config/HistoryConfig";

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

    const workSpace = $getCurrentWorkSpace();
    const node: HTMLElement | undefined = element.children[workSpace.historyIndex] as HTMLElement;
    if (!node) {
        return ;
    }

    // 履歴表示をアクティブに更新
    node.setAttribute("class", "");

    const historyObject: HistoryObjectImpl = workSpace.histories[workSpace.historyIndex++];
    switch (historyObject.command) {

        case $TIMELINE_TOOL_LAYER_ADD_COMMAD:
            timelineToolLayerAddHistoryRedoUseCase(
                historyObject.object as NonNullable<Layer>
            );
            break;

        default:
            break;

    }
};