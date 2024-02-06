import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as workSpaceUpdateNameReceiveUseCase } from "@/share/receive/application/core/application/WorkSpace/usecase/WorkSpaceUpdateNameReceiveUseCase";
import { execute as timelineToolLayerAddReceiveService } from "@/share/receive/application/timeline/application/TimelineTool/application/LayerAdd/service/TimelineToolLayerAddReceiveService";
import { execute as timelineToolLayerDeleteReceiveService } from "@/share/receive/application/timeline/application/TimelineTool/application/LayerDelete/service/TimelineToolLayerDeleteReceiveService";
import { execute as timelineLayerControllerLayerNameUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerNameUpdateReceiveUseCase";
import { execute as timelineLayerControllerLayerLockUpdateReceiveService } from "@/share/receive/application/timeline/application/TimelineLayerController/service/TimelineLayerControllerLayerLockUpdateReceiveService";
import { execute as timelineLayerControllerLayerDisableUpdateReceiveService } from "@/share/receive/application/timeline/application/TimelineLayerController/service/TimelineLayerControllerLayerDisableUpdateReceiveService";
import { execute as timelineLayerControllerLayerLightUpdateReceiveService } from "@/share/receive/application/timeline/application/TimelineLayerController/service/TimelineLayerControllerLayerLightUpdateReceiveService";
import { execute as scriptEditorNewRegisterReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterReceiveUseCase";
import { execute as scriptEditorUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/ScriptEditorUpdate/usecase/ScriptEditorUpdateReceiveUseCase";
import { execute as scriptEditorDeleteReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/ScriptEditorDelete/usecase/ScriptEditorDeleteReceiveUseCase";
import { execute as folderAddNewReceiveService } from "@/share/receive/application/core/application/Folder/service/FolderAddNewReceiveService";
import { execute as folderUpdateStateReceiveService } from "@/share/receive/application/core/application/Folder/service/FolderUpdateStateReceiveService";
import { execute as historyRedoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryUndoUseCase";
import {
    $HISTORY_REDO_COMMAND,
    $HISTORY_UNDO_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
    $LAYER_LOCK_UPDATE_COMMAND,
    $LAYER_DISABLE_UPDATE_COMMAND,
    $LAYER_LIGHT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
    $LIBRARY_ADD_NEW_FOLDER_COMMAND,
    $LIBRARY_FOLDER_STATE_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 共有者からの作業履歴の受け取り
 *              Receive work history from co-owners
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    switch (message.historyCommand) {

        // Undo処理
        case $HISTORY_UNDO_COMMAND:
            historyUndoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>,
                true
            );
            break;

        // Redo処理
        case $HISTORY_REDO_COMMAND:
            historyRedoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>,
                true
            );
            break;

        // タブ名の変更
        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            workSpaceUpdateNameReceiveUseCase(message);
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddReceiveService(message);
            break;

        // 新規レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteReceiveService(message);
            break;

        // レイヤー名の変更
        case $LAYER_NAME_UPDATE_COMMAND:
            timelineLayerControllerLayerNameUpdateReceiveUseCase(message);
            break;

        // レイヤーのロックを更新
        case $LAYER_LOCK_UPDATE_COMMAND:
            timelineLayerControllerLayerLockUpdateReceiveService(message);
            break;

        // レイヤー表示を更新
        case $LAYER_DISABLE_UPDATE_COMMAND:
            timelineLayerControllerLayerDisableUpdateReceiveService(message);
            break;

        // レイヤーハイライトを更新
        case $LAYER_LIGHT_UPDATE_COMMAND:
            timelineLayerControllerLayerLightUpdateReceiveService(message);
            break;

        // 新規スクリプトを追加
        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            scriptEditorNewRegisterReceiveUseCase(message);
            break;

        // スクリプトを更新
        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            scriptEditorUpdateReceiveUseCase(message);
            break;

        // スクリプトを削除
        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            scriptEditorDeleteReceiveUseCase(message);
            break;

        // 新規フォルダー追加
        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            folderAddNewReceiveService(message);
            break;

        // フォルダの開閉更新
        case $LIBRARY_FOLDER_STATE_COMMAND:
            folderUpdateStateReceiveService(message);
            break;

        default:
            break;

    }
};