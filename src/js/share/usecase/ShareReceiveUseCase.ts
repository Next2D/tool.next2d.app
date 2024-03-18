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
import { execute as videoAddNewReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Video/usecase/VideoAddNewReceiveUseCase";
import { execute as videoUpdateReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Video/usecase/VideoUpdateReceiveUseCase";
import { execute as soundAddNewReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Sound/usecase/SoundAddNewReceiveUseCase";
import { execute as soundUpdateReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Sound/usecase/SoundUpdateReceiveUseCase";
import { execute as folderAddNewReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Folder/usecase/FolderAddNewReceiveUseCase";
import { execute as folderMoveReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Folder/usecase/FolderMoveReceiveUseCase";
import { execute as bitmapAddNewReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Bitmap/usecase/BitmapAddNewReceiveUseCase";
import { execute as bitmapUpdateReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Bitmap/usecase/BitmapUpdateReceiveUseCase";
import { execute as folderUpdateStateReceiveService } from "@/share/receive/application/controller/application/LibraryArea/Folder/service/FolderUpdateStateReceiveService";
import { execute as instanceUpdateNameReceiveUseCase } from "@/share/receive/application/core/application/Instance/usecase/InstanceUpdateNameReceiveUseCase";
import { execute as instanceUpdateSymbolReceiveUseCase } from "@/share/receive/application/core/application/Instance/usecase/InstanceUpdateSymbolReceiveUseCase";
import { execute as movieClipAddNewReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/MovieClip/usecase/MovieClipAddNewReceiveUseCase";
import { execute as instanceRemoveReceiveUseCase } from "@/share/receive/application/controller/application/LibraryArea/Instance/InstanceRemoveReceiveUseCase";
import { execute as timelineLayerControllerLayerMoveReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerMoveReceiveUseCase";
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
    $LIBRARY_FOLDER_STATE_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND,
    $LIBRARY_ADD_NEW_BITMAP_COMMAND,
    $LIBRARY_MOVE_FOLDER_COMMAND,
    $LIBRARY_OVERWRITE_IMAGE_COMMAND,
    $LIBRARY_ADD_NEW_VIDEO_COMMAND,
    $LIBRARY_OVERWRITE_VIDEO_COMMAND,
    $LIBRARY_ADD_NEW_SOUND_COMMAND,
    $LIBRARY_OVERWRITE_SOUND_COMMAND,
    $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND,
    $LIBRARY_REMOVE_INSTANCE_COMMAND,
    $TIMELINE_MOVE_LAYER_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 共有者からの作業履歴の受け取り
 *              Receive work history from co-owners
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
{
    switch (message.historyCommand) {

        // Undo処理
        case $HISTORY_UNDO_COMMAND:
            await historyUndoUseCase(
                message.data[0] as NonNullable<number>,
                message.data[1] as NonNullable<number>,
                true
            );
            break;

        // Redo処理
        case $HISTORY_REDO_COMMAND:
            await historyRedoUseCase(
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
            folderAddNewReceiveUseCase(message);
            break;

        // フォルダの開閉更新
        case $LIBRARY_FOLDER_STATE_COMMAND:
            folderUpdateStateReceiveService(message);
            break;

        // インスタンス名の更新
        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            instanceUpdateNameReceiveUseCase(message);
            break;

        // シンボル名の更新
        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            instanceUpdateSymbolReceiveUseCase(message);
            break;

        // 新規bitmap追加
        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            await bitmapAddNewReceiveUseCase(message);
            break;

        // フォルダ移動
        case $LIBRARY_MOVE_FOLDER_COMMAND:
            folderMoveReceiveUseCase(message);
            break;

        // 画像の上書き
        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            await bitmapUpdateReceiveUseCase(message);
            break;

        // 動画の取り込み
        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            await videoAddNewReceiveUseCase(message);
            break;

        // 動画の上書き
        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            await videoUpdateReceiveUseCase(message);
            break;

        // 音声の取り込み
        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            await soundAddNewReceiveUseCase(message);
            break;

        // 音声の上書き
        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            await soundUpdateReceiveUseCase(message);
            break;

        // ライブラリに新規MovieClipを追加
        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            movieClipAddNewReceiveUseCase(message);
            break;

        // ライブラリからインスタンスを削除
        case $LIBRARY_REMOVE_INSTANCE_COMMAND:
            instanceRemoveReceiveUseCase(message);
            break;

        // レイヤー移動
        case $TIMELINE_MOVE_LAYER_COMMAND:
            timelineLayerControllerLayerMoveReceiveUseCase(message);
            break;

        default:
            break;

    }
};