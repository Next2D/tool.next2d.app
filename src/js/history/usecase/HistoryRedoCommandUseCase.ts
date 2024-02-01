import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { execute as screenTabNameAddHistoryRedoUseCase } from "../application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryRedoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "../application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "../application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryRedoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryRedoUseCase } from "../application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryRedoUseCase";
import { execute as scriptEditorNewRegisterHistoryRedoUseCase } from "../application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryRedoUseCase";
import {
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description Redoコマンドの実行関数
 *              Execution function of the Redo command
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
            timelineLayerControllerLayerNameUpdateHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number, // Layer Index,
                args[4] as string  // afterName
            );
            break;

        // タブ名の変更
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[2] as string  // afterName
            );
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number, // Layer Index
                args[3] as string, // Layer Name
                args[4] as string  // Layer Color
            );
            break;

        // レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number  // Layer index
            );
            break;

        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            scriptEditorNewRegisterHistoryRedoUseCase(
                args[0] as number, // workSpaceId
                args[1] as number, // MovieClipId
                args[2] as number, // frame
                args[3] as string  // script
            );
            break;

        default:
            break;

    }
};