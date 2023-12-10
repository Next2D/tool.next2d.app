import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import type { Layer } from "@/core/domain/model/Layer";
import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";

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
    const workSpace = $getCurrentWorkSpace();
    const historyObject: HistoryObjectImpl = workSpace.histories[++workSpace.historyIndex];
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