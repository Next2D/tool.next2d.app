import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { execute as screenTabNameAddHistoryUndoUseCase } from "../application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "../application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import {
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description Undoコマンドの実行関数
 *              Execution function of the Undo command
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (history_object: HistoryObjectImpl): void =>
{
    const args = history_object.args;
    switch (history_object.command) {

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as string  // beforeName
            );
            break;

        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[3] as number  // Index
            );
            break;

        default:
            break;

    }
};