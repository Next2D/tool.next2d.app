import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { execute as screenTabNameAddHistoryRedoUseCase } from "@/history/application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryRedoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryRedoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryRedoUseCase } from "@/history/application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryRedoUseCase";
import { execute as scriptEditorNewRegisterHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryRedoUseCase";
import { execute as scriptEditorUpdateHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryRedoUseCase";
import { execute as scriptEditorDeleteHistoryRedoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryRedoUseCase";
import { execute as libraryAreaAddNewFolderHistoryRedoUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryRedoUseCase";
import { execute as libraryAreaMoveFolderHistoryRedoUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryRedoUseCase";
import { execute as libraryAreaAddNewBitmapHistoryRedoUseCase } from "@/history/application/controller/LibraryArea/Bitmap/usecase/LibraryAreaAddNewBitmapHistoryRedoUseCase";
import { execute as instanceUpdateNameHistoryRedoUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateNameHistoryRedoUseCase";
import { execute as instanceUpdateSymbolHistoryRedoUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateSymbolHistoryRedoUseCase";
import {
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
    $LIBRARY_ADD_NEW_FOLDER_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND,
    $LIBRARY_ADD_NEW_BITMAP_COMMAND,
    $LIBRARY_MOVE_FOLDER_COMMAND
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
    const messages = history_object.messages;
    switch (history_object.command) {

        // レイヤー名を変更
        case $LAYER_NAME_UPDATE_COMMAND:
            timelineLayerControllerLayerNameUpdateHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index,
                messages[4] as string  // afterName
            );
            break;

        // タブ名の変更
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as string  // afterName
            );
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index
                messages[3] as string, // Layer Name
                messages[4] as string  // Layer Color
            );
            break;

        // レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number  // Layer index
            );
            break;

        // スクリプトの新規追加
        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            scriptEditorNewRegisterHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // frame
                messages[3] as string  // script
            );
            break;

        // スクリプトの変更
        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            scriptEditorUpdateHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // frame
                messages[4] as string // after script
            );
            break;

        // スクリプトの削除
        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            scriptEditorDeleteHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number // frame
            );
            break;

        // 新規フォルダ追加
        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            libraryAreaAddNewFolderHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // FolderId
                messages[3] as string, // Folder Name
                messages[4] as number // Parent FolderId
            );
            break;

        // インスタンス名を変更
        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            instanceUpdateNameHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[4] as string  // after name
            );
            break;

        // インスタンスのシンボル名を変更
        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            instanceUpdateSymbolHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[4] as string  // after name
            );
            break;

        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            libraryAreaAddNewBitmapHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as BitmapSaveObjectImpl // Bitmap Save Object
            );
            break;

        case $LIBRARY_MOVE_FOLDER_COMMAND:
            libraryAreaMoveFolderHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[4] as number // After FolderID
            );
            break;

        default:
            break;

    }
};