import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import { execute as screenTabNameAddHistoryUndoUseCase } from "../application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "../application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import { execute as timelineToolLayerDeleteHistoryUndoUseCase } from "../application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUndoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUndoUseCase } from "../application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUndoUseCase";
import {
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND
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

        // レイヤー名を変更
        case $LAYER_NAME_UPDATE_COMMAND:
            timelineLayerControllerLayerNameUpdateHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number, // Layer Index,
                args[3] as string  // beforeName
            );
            break;

        // タブ名を更新
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as string  // beforeName
            );
            break;

        // レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number  // Layer Index
            );
            break;

        // レイヤーの削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryUndoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number, // Layer Index
                args[3] as LayerSaveObjectImpl // Layer Object
            );
            break;

        default:
            break;

    }
};