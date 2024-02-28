import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { execute as screenTabNameAddHistoryRedoUseCase } from "@/history/application/screen/application/ScreenTab/usecase/ScreenTabNameAddHistoryRedoUseCase";
import { execute as timelineToolLayerAddHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryRedoUseCase";
import { execute as timelineToolLayerDeleteHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryRedoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryRedoUseCase";
import { execute as scriptEditorNewRegisterHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryRedoUseCase";
import { execute as scriptEditorUpdateHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryRedoUseCase";
import { execute as scriptEditorDeleteHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryRedoUseCase";
import { execute as libraryAreaAddNewFolderHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryRedoUseCase";
import { execute as libraryAreaMoveFolderHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryRedoUseCase";
import { execute as libraryAreaAddNewVideoHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaAddNewVideoHistoryRedoUseCase";
import { execute as libraryAreaUpdateVideoHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaUpdateVideoHistoryRedoUseCase";
import { execute as libraryAreaAddNewBitmapHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaAddNewBitmapHistoryRedoUseCase";
import { execute as libraryAreaUpdateBitmapHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryRedoUseCase";
import { execute as instanceUpdateNameHistoryRedoUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateNameHistoryRedoUseCase";
import { execute as instanceUpdateSymbolHistoryRedoUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateSymbolHistoryRedoUseCase";
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
    $LIBRARY_MOVE_FOLDER_COMMAND,
    $LIBRARY_OVERWRITE_IMAGE_COMMAND,
    $LIBRARY_ADD_NEW_VIDEO_COMMAND,
    $LIBRARY_OVERWRITE_VIDEO_COMMAND
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

        // 新規bitmap追加
        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            libraryAreaAddNewBitmapHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as BitmapSaveObjectImpl // Bitmap Save Object
            );
            break;

        // フォルダ移動追加
        case $LIBRARY_MOVE_FOLDER_COMMAND:
            libraryAreaMoveFolderHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[4] as number // After FolderID
            );
            break;

        // 画像の上書き
        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            libraryAreaUpdateBitmapHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[3] as BitmapSaveObjectImpl // Bitmap Save Object
            );
            break;

        // 動画の追加
        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            libraryAreaAddNewVideoHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as VideoSaveObjectImpl // Video Save Object
            );
            break;

        // 動画の上書き
        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            libraryAreaUpdateVideoHistoryRedoUseCase(
                messages[0] as number, // workSpaceId,
                messages[3] as VideoSaveObjectImpl // Video Save Object
            );
            break;

        default:
            break;

    }
};