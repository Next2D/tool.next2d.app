import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { execute as screenTabNameAddHistoryUndoUseCase } from "@/history/application/screen/ScreenTab/usecase/ScreenTabNameAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import { execute as timelineToolLayerDeleteHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUndoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUndoUseCase } from "@/history/application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUndoUseCase";
import { execute as scriptEditorNewRegisterHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUndoUseCase";
import { execute as scriptEditorUpdateHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUndoUseCase";
import { execute as scriptEditorDeleteHistoryUndoUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUndoUseCase";
import { execute as libraryAreaAddNewFolderHistoryUndoUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUndoUseCase";
import { execute as libraryAreaMoveFolderHistoryUndoUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUndoUseCase";
import { execute as libraryAreaAddNewVideoHistoryUndoUseCase } from "@/history/application/controller/LibraryArea/Video/usecase/LibraryAreaAddNewVideoHistoryUndoUseCase";
import { execute as libraryAreaAddNewBitmapHistoryUndoUseCase } from "@/history/application/controller/LibraryArea/Bitmap/usecase/LibraryAreaAddNewBitmapHistoryUndoUseCase";
import { execute as libraryAreaUpdateBitmapHistoryUndoUseCase } from "@/history/application/controller/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUndoUseCase";
import { execute as instanceUpdateNameHistoryUndoUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateNameHistoryUndoUseCase";
import { execute as instanceUpdateSymbolHistoryUndoUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateSymbolHistoryUndoUseCase";
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
    $LIBRARY_ADD_NEW_VIDEO_COMMAND
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
    const messages = history_object.messages;
    switch (history_object.command) {

        // レイヤー名を変更
        case $LAYER_NAME_UPDATE_COMMAND:
            timelineLayerControllerLayerNameUpdateHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index,
                messages[3] as string  // beforeName
            );
            break;

        // タブ名を更新
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            screenTabNameAddHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as string  // beforeName
            );
            break;

        // レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number  // Layer Index
            );
            break;

        // レイヤーの削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index
                messages[3] as LayerSaveObjectImpl // Layer Object
            );
            break;

        // スクリプトの新規追加
        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            scriptEditorNewRegisterHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number // frame
            );
            break;

        // スクリプトの変更
        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            scriptEditorUpdateHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // frame
                messages[3] as string // before script
            );
            break;

        // スクリプトの削除
        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            scriptEditorDeleteHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // frame
                messages[3] as string // after script
            );
            break;

        // 新規フォルダ追加
        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            libraryAreaAddNewFolderHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number // Folder Id
            );
            break;

        // インスタンス名を変更
        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            instanceUpdateNameHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[3] as string  // before name
            );
            break;

        // インスタンスのシンボル名を変更
        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            instanceUpdateSymbolHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[3] as string  // before name
            );
            break;

        // 新規bitmap追加
        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            libraryAreaAddNewBitmapHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as BitmapSaveObjectImpl // Bitmap Save Object
            );
            break;

        // フォルダ移動追加
        case $LIBRARY_MOVE_FOLDER_COMMAND:
            libraryAreaMoveFolderHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number, // InstanceId
                messages[3] as number // Before FolderID
            );
            break;

        // 画像の上書き
        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            libraryAreaUpdateBitmapHistoryUndoUseCase(
                messages[0] as number, // workSpaceId,
                messages[2] as BitmapSaveObjectImpl // Bitmap Save Object
            );
            break;

        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            libraryAreaAddNewVideoHistoryUndoUseCase(
                messages[0] as number, // workSpaceId,
                messages[2] as VideoSaveObjectImpl // Video Save Object
            );
            break;

        default:
            break;

    }
};