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
import { execute as layerUpdateLightColorReceiveUseCase } from "@/share/receive/application/core/application/Layer/usecase/LayerUpdateLightColorReceiveUseCase";
import { execute as layerUpdateModeReceiveUseCase } from "@/share/receive/application/core/application/Layer/usecase/LayerUpdateModeReceiveUseCase";
import { execute as timelineLayerControllerLayerMoveReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerLayerMoveReceiveUseCase";
import { execute as timelineLayerFrameAddEmptyKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameAddEmptyKeyframeReceiveUseCase";
import { execute as timelineLayerFrameUpdateEmptyKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeReceiveUseCase";
import { execute as timelineLayerFrameSplitEmptyKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeReceiveUseCase";
import { execute as timelineLayerFrameInsertEmptyFramesReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameInsertEmptyFramesReceiveUseCase";
import { execute as timelineLayerFrameAddKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameAddKeyframeReceiveUseCase";
import { execute as timelineLayerFrameInsertkeyframesReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameInsertkeyframesReceiveUseCase";
import { execute as timelineLayerFrameUpdateKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameUpdateKeyframeReceiveUseCase";
import { execute as timelineLayerFrameSplitKeyframeToEmptyReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameSplitKeyframeToEmptyReceiveUseCase";
import { execute as timelineLayerFrameSplitKeyframeToKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameSplitKeyframeToKeyframeReceiveUseCase";
import { execute as timelineLayerFrameRemoveEmptyFramesReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameRemoveEmptyFramesReceiveUseCase";
import { execute as timelineLayerFrameRemoveKeyFramesReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameRemoveKeyFramesReceiveUseCase";
import { execute as timelineLayerFrameEraseEmptyKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameEraseEmptyKeyframeReceiveUseCase";
import { execute as timelineLayerFrameEraseKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameEraseKeyframeReceiveUseCase";
import { execute as timelineLayerFrameDeleteEmptyFrameReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/EmptyKeyframe/usecase/TimelineLayerFrameDeleteEmptyFrameReceiveUseCase";
import { execute as timelineLayerFrameDeleteKeyframeReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineLayerFrame/application/Keyframe/usecase/TimelineLayerFrameDeleteKeyframeReceiveUseCase";
import { execute as soundAreaAddSoundReceiveUseCase } from "@/share/receive/application/controller/application/SoundArea/usecase/SoundAreaAddSoundReceiveUseCase";
import { execute as soundAreaRemoveSoundReceiveUseCase } from "@/share/receive/application/controller/application/SoundArea/usecase/SoundAreaRemoveSoundReceiveUseCase";
import { execute as soundAreaUpdateVolumeReceiveUseCase } from "@/share/receive/application/controller/application/SoundArea/usecase/SoundAreaUpdateVolumeReceiveUseCase";
import { execute as soundAreaUpdateLoopCountReceiveUseCase } from "@/share/receive/application/controller/application/SoundArea/usecase/SoundAreaUpdateLoopCountReceiveUseCase";
import { execute as labelNewRegisterReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/LabelNewRegister/usecase/LabelNewRegisterReceiveUseCase";
import { execute as labelUpdateReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/LabelUpdate/usecase/LabelUpdateReceiveUseCase";
import { execute as labelDeleteReceiveUseCase } from "@/share/receive/application/timeline/application/TimelineTool/application/LabelDelete/usecase/LabelDeleteReceiveUseCase";
import { execute as stageSettingUpdateWidthReceiveUseCase } from "@/share/receive/application/controller/application/StageSetting/usecase/StageSettingUpdateWidthReceiveUseCase";
import { execute as stageSettingUpdateHeightReceiveUseCase } from "@/share/receive/application/controller/application/StageSetting/usecase/StageSettingUpdateHeightReceiveUseCase";
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
    $TIMELINE_MOVE_LAYER_COMMAND,
    $LAYER_UPDATE_LIGHT_COLOR_COMMAND,
    $LAYER_UPDATE_MODE_COMMAND,
    $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND,
    $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND,
    $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND,
    $TIMELINE_INSERT_EMPTY_FRAME_COMMAND,
    $TIMELINE_ADD_KEYFRAME_COMMAND,
    $TIMELINE_INSERT_KEY_FRAME_COMMAND,
    $TIMELINE_UPDATE_KEYFRAME_COMMAND,
    $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND,
    $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND,
    $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND,
    $TIMELINE_REMOVE_KEY_FRAMES_COMMAND,
    $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND,
    $TIMELINE_ERASE_KEY_FRAME_COMMAND,
    $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND,
    $TIMELINE_DELETE_KEY_FRAME_COMMAND,
    $SOUND_AREA_ADD_SOUND_COMMAND,
    $SOUND_AREA_REMOVE_SOUND_COMMAND,
    $SOUND_AREA_UPDATE_VOLUME_COMMAND,
    $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND,
    $LABEL_NEW_REGISTER_COMMAND,
    $LABEL_UPDATE_COMMAND,
    $LABEL_DELETE_COMMAND,
    $STAGE_WIDTH_COMMAND,
    $STAGE_HEIGHT_COMMAND
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
            await workSpaceUpdateNameReceiveUseCase(message);
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddReceiveService(message);
            break;

        // 新規レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            await timelineToolLayerDeleteReceiveService(message);
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

        // レイヤーのハイライト表示を更新
        case $LAYER_UPDATE_LIGHT_COLOR_COMMAND:
            layerUpdateLightColorReceiveUseCase(message);
            break;

        // レイヤーのモードを更新
        case $LAYER_UPDATE_MODE_COMMAND:
            layerUpdateModeReceiveUseCase(message);
            break;

        // 空のキーフレームを追加
        case $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameAddEmptyKeyframeReceiveUseCase(message);
            break;

        // 空のキーフレームを更新
        case $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateEmptyKeyframeReceiveUseCase(message);
            break;

        // 空のキーフレームを分割
        case $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND:
            timelineLayerFrameSplitEmptyKeyframeReceiveUseCase(message);
            break;

        // 空のキーフレームにフレームを挿入
        case $TIMELINE_INSERT_EMPTY_FRAME_COMMAND:
            await timelineLayerFrameInsertEmptyFramesReceiveUseCase(message);
            break;

        // キーフレームを追加
        case $TIMELINE_ADD_KEYFRAME_COMMAND:
            await timelineLayerFrameAddKeyframeReceiveUseCase(message);
            break;

        // キーフレームにフレームを挿入
        case $TIMELINE_INSERT_KEY_FRAME_COMMAND:
            await timelineLayerFrameInsertkeyframesReceiveUseCase(message);
            break;

        // キーフレームを更新
        case $TIMELINE_UPDATE_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateKeyframeReceiveUseCase(message);
            break;

        // キーフレームを分割して空のキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND:
            await timelineLayerFrameSplitKeyframeToEmptyReceiveUseCase(message);
            break;

        // キーフレームを分割してキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND:
            timelineLayerFrameSplitKeyframeToKeyframeReceiveUseCase(message);
            break;

        // 空のキーフレームのフレームを削除
        case $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND:
            await timelineLayerFrameRemoveEmptyFramesReceiveUseCase(message);
            break;

        // キーフレームのフレームを削除
        case $TIMELINE_REMOVE_KEY_FRAMES_COMMAND:
            await timelineLayerFrameRemoveKeyFramesReceiveUseCase(message);
            break;

        // 空のキーフレームのフレーム全削除
        case $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND:
            await timelineLayerFrameEraseEmptyKeyframeReceiveUseCase(message);
            break;

        // キーフレームのフレーム全削除
        case $TIMELINE_ERASE_KEY_FRAME_COMMAND:
            await timelineLayerFrameEraseKeyframeReceiveUseCase(message);
            break;

        // 空のキーフレームの削除
        case $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteEmptyFrameReceiveUseCase(message);
            break;

        // キーフレームの削除
        case $TIMELINE_DELETE_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteKeyframeReceiveUseCase(message);
            break;

        // MovieClipへのサウンドを追加
        case $SOUND_AREA_ADD_SOUND_COMMAND:
            soundAreaAddSoundReceiveUseCase(message);
            break;

        // MovieClipのサウンドを削除
        case $SOUND_AREA_REMOVE_SOUND_COMMAND:
            soundAreaRemoveSoundReceiveUseCase(message);
            break;

        // 個別のサウンドの音量を更新
        case $SOUND_AREA_UPDATE_VOLUME_COMMAND:
            soundAreaUpdateVolumeReceiveUseCase(message);
            break;

        // 個別のサウンドのループ回数を更新
        case $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND:
            soundAreaUpdateLoopCountReceiveUseCase(message);
            break;

        // 新規ラベルを追加
        case $LABEL_NEW_REGISTER_COMMAND:
            labelNewRegisterReceiveUseCase(message);
            break;

        // ラベルを更新
        case $LABEL_UPDATE_COMMAND:
            labelUpdateReceiveUseCase(message);
            break;

        // ラベルを削除
        case $LABEL_DELETE_COMMAND:
            labelDeleteReceiveUseCase(message);
            break;

        // ステージの幅を更新
        case $STAGE_WIDTH_COMMAND:
            stageSettingUpdateWidthReceiveUseCase(message);
            break;

        // ステージの高さを更新
        case $STAGE_HEIGHT_COMMAND:
            stageSettingUpdateHeightReceiveUseCase(message);
            break;

        default:
            break;

    }
};