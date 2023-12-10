import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import type { Layer } from "@/core/domain/model/Layer";

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
    const workSpace = $getCurrentWorkSpace();
    if (!workSpace.historyIndex) {
        return ;
    }

    const historyObject: HistoryObjectImpl = workSpace.histories[--workSpace.historyIndex];
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