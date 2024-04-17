import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
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
import { execute as libraryAreaAddNewSoundHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaAddNewSoundHistoryRedoUseCase";
import { execute as libraryAreaUpdateSoundHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaUpdateSoundHistoryRedoUseCase";
import { execute as libraryAreaAddNewMovieClipHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/MovieClip/usecase/LibraryAreaAddNewMovieClipHistoryRedoUseCase";
import { execute as libraryAreaRemoveInstanceHistoryRedoUseCase } from "@/history/application/controller/application/LibraryArea/Instance/usecase/LibraryAreaRemoveInstanceHistoryRedoUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryRedoUseCase";
import { execute as layerUpdateLightColorHistoryRedoUseCase } from "@/history/application/core/application/Layer/usecase/LayerUpdateLightColorHistoryRedoUseCase";
import { execute as layerUpdateModeHistoryRedoUseCase } from "@/history/application/core/application/Layer/usecase/LayerUpdateModeHistoryRedoUseCase";
import { execute as timelineLayerFrameCreateEmptyKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddEmptyKeyframe/usecase/TimelineLayerFrameCreateEmptyKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameUpdateEmptyKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateEmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameSplitEmptyKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitEmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameInsertEmptyFramesHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertEmptyFrames/usecase/TimelineLayerFrameInsertEmptyFramesHistoryRedoUseCase";
import { execute as timelineLayerFrameAddKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameInsertKeyFramesHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertKeyFrames/usecase/TimelineLayerFrameInsertKeyFramesHistoryRedoUseCase";
import { execute as timelineLayerFrameUpdateKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateKeyframe/usecase/TimelineLayerFrameUpdateKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameSplitKeyframeToKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitKeyframeToKeyframe/usecase/TimelineLayerFrameSplitKeyframeToKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameSplitKeyframeToEmptyHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitKeyframeToEmpty/usecase/TimelineLayerFrameSplitKeyframeToEmptyHistoryRedoUseCase";
import { execute as timelineLayerFrameRemoveEmptyFramesHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveEmptyFrames/usecase/TimelineLayerFrameRemoveEmptyFramesHistoryRedoUseCase";
import { execute as timelineLayerFrameRemoveKeyFramesHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveKeyFrames/usecase/TimelineLayerFrameRemoveKeyFramesHistoryRedoUseCase";
import { execute as timelineLayerFrameEraseEmptyKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseEmptyKeyframe/usecase/TimelineLayerFrameEraseEmptyKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameEraseKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseKeyframe/usecase/TimelineLayerFrameEraseKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameDeleteEmptyKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteEmptyKeyframe/usecase/TimelineLayerFrameDeleteEmptyKeyframeHistoryRedoUseCase";
import { execute as timelineLayerFrameDeleteKeyframeHistoryRedoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteKeyframe/usecase/TimelineLayerFrameDeleteKeyframeHistoryRedoUseCase";
import { execute as propertyAreaAddSoundHistoryRedoUseCase } from "@/history/application/controller/application/SoundArea/AddSound/usecase/PropertyAreaAddSoundHistoryRedoUseCase";
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
    $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description Redoコマンドの実行関数
 *              Execution function of the Redo command
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    history_object: HistoryObjectImpl
): Promise<void> => {

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
            await screenTabNameAddHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[3] as string  // afterName
            );
            break;

        // 新規レイヤー追加
        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            timelineToolLayerAddHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index
                messages[3] as number, // Layer ID
                messages[4] as string, // Layer Name
                messages[5] as string  // Layer Color
            );
            break;

        // レイヤー削除
        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            timelineToolLayerDeleteHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number,  // Layer index
                messages[3] as number[] // Child Layer indexes
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

        // 音声の追加
        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            libraryAreaAddNewSoundHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as SoundSaveObjectImpl // Sound Save Object
            );
            break;

        // 音声の上書き
        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            libraryAreaUpdateSoundHistoryRedoUseCase(
                messages[0] as number, // workSpaceId,
                messages[3] as SoundSaveObjectImpl // Sound Save Object
            );
            break;

        // MovieClipの追加
        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            libraryAreaAddNewMovieClipHistoryRedoUseCase(
                messages[0] as number, // workSpaceId,
                messages[2] as number, // MovieCLip ID,
                messages[3] as string, // MovieCLip name,
                messages[4] as number // Folder ID,
            );
            break;

        // ライブラリのアイテムを削除
        case $LIBRARY_REMOVE_INSTANCE_COMMAND:
            libraryAreaRemoveInstanceHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as InstanceSaveObjectImpl // save object
            );
            break;

        // レイヤーの移動
        case $TIMELINE_MOVE_LAYER_COMMAND:
            timelineLayerControllerMoveLayerHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Before Index
                messages[3] as number, // After Index
                messages[5] as LayerModeImpl, // Layer Mode
                messages[7] as number // Layer Parent Index
            );
            break;

        // レイヤーのハイライトカラーの変更
        case $LAYER_UPDATE_LIGHT_COLOR_COMMAND:
            layerUpdateLightColorHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[4] as string  // After Color
            );
            break;

        // レイヤーモードを変更
        case $LAYER_UPDATE_MODE_COMMAND:
            layerUpdateModeHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[4] as LayerModeImpl, // After Mode
                messages[6] as number // After Parent ID
            );
            break;

        // 空のキーフレーム追加
        case $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameCreateEmptyKeyframeHistoryRedoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Start Frame
                messages[4] as number // End Frame
            );
            break;

        // 空のキーフレーム変更
        case $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateEmptyKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[5] as number // after frame
            );
            break;

        // 空のキーフレームの分割
        case $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND:
            timelineLayerFrameSplitEmptyKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[4] as number // New EmptyCharacter Keyframe

            );
            break;

        // 空のキーフレームへフレームを挿入
        case $TIMELINE_INSERT_EMPTY_FRAME_COMMAND:
            await timelineLayerFrameInsertEmptyFramesHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number // NumFrame
            );
            break;

        // キーフレーム追加
        case $TIMELINE_ADD_KEYFRAME_COMMAND:
            await timelineLayerFrameAddKeyframeHistoryRedoUseCase(
                messages[0] as number, // work_space_id
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as CharacterSaveObjectImpl // SaveObject
            );
            break;

        // キーフレームへフレームを挿入
        case $TIMELINE_INSERT_KEY_FRAME_COMMAND:
            timelineLayerFrameInsertKeyFramesHistoryRedoUseCase(
                messages[0] as number, // work_space_id
                messages[1] as number, // library_id
                messages[2] as number, // layer_index
                messages[3] as number, // Start Frame
                messages[4] as number // NumFrame
            );
            break;

        // キーフレーム変更
        case $TIMELINE_UPDATE_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateKeyframeHistoryRedoUseCase(
                messages[0] as number, // work_space_id
                messages[1] as number, // library_id
                messages[2] as number, // layer_index
                messages[3] as number, // Keyframe
                messages[5] as number // After Frame
            );
            break;

        // キーフレームを分割して空のキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND:
            await timelineLayerFrameSplitKeyframeToEmptyHistoryRedoUseCase(
                messages[0] as number, // work_space_id
                messages[1] as number, // library_id
                messages[2] as number, // layer_index
                messages[4] as number // Keyframe
            );
            break;

        // キーフレームを分割してキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND:
            timelineLayerFrameSplitKeyframeToKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number // Character Keyframe
            );
            break;

        // 空のキーフレームのフレームを削除
        case $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND:
            await timelineLayerFrameRemoveEmptyFramesHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[4] as number, // Before EndFrame
                messages[5] as number // After EndFrame
            );
            break;

        // キーフレームのフレームを削除
        case $TIMELINE_REMOVE_KEY_FRAMES_COMMAND:
            await timelineLayerFrameRemoveKeyFramesHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Before EndFrame
                messages[5] as number // After EndFrame
            );
            break;

        // 空のキーフレームのフレーム全削除
        case $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND:
            await timelineLayerFrameEraseEmptyKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number  // EmptyCharacter Keyframe
            );
            break;

        // キーフレームのフレーム全削除
        case $TIMELINE_ERASE_KEY_FRAME_COMMAND:
            await timelineLayerFrameEraseKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as CharacterSaveObjectImpl[] // Character Save Object
            );
            break;

        // 空のキーフレームの削除
        case $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteEmptyKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number  // EmptyCharacter Keyframe
            );
            break;

        // キーフレームの削除
        case $TIMELINE_DELETE_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteKeyframeHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as CharacterSaveObjectImpl[] // Character Save Object
            );
            break;

        // MovieClipにサウンドを追加
        case $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND:
            propertyAreaAddSoundHistoryRedoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Frame
                messages[3] as number, // Sound Index
                messages[4] as SoundObjectImpl // Sound Object
            );
            break;

        default:
            break;

    }
};