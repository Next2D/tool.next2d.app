import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { ILayerSaveObject } from "@/interface/ILayerSaveObject";
import type { IBitmapSaveObject } from "@/interface/IBitmapSaveObject";
import type { IVideoSaveObject } from "@/interface/IVideoSaveObject";
import type { ISoundSaveObject } from "@/interface/ISoundSaveObject";
import type { IInstanceSaveObject } from "@/interface/IInstanceSaveObject";
import type { ILayerMode } from "@/interface/ILayerMode";
import type { IEmptyCharacterSaveObject } from "@/interface/IEmptyCharacterSaveObject";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import type { ISoundObject } from "@/interface/ISoundObject";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { IPivotType } from "@/interface/IPivotType";
import type { IBlendMode } from "@/interface/IBlendMode";
import { execute as screenTabNameAddHistoryUndoUseCase } from "@/history/application/screen/application/ScreenTab/usecase/ScreenTabNameAddHistoryUndoUseCase";
import { execute as timelineToolLayerAddHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUndoUseCase";
import { execute as timelineToolLayerDeleteHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUndoUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUndoUseCase";
import { execute as scriptEditorNewRegisterHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUndoUseCase";
import { execute as scriptEditorUpdateHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUndoUseCase";
import { execute as scriptEditorDeleteHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUndoUseCase";
import { execute as libraryAreaAddNewFolderHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUndoUseCase";
import { execute as libraryAreaMoveFolderHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUndoUseCase";
import { execute as libraryAreaAddNewVideoHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaAddNewVideoHistoryUndoUseCase";
import { execute as libraryAreaUpdateVideoHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaUpdateVideoHistoryUndoUseCase";
import { execute as libraryAreaAddNewBitmapHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaAddNewBitmapHistoryUndoUseCase";
import { execute as libraryAreaUpdateBitmapHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUndoUseCase";
import { execute as libraryAreaAddNewSoundHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaAddNewSoundHistoryUndoUseCase";
import { execute as libraryAreaUpdateSoundHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaUpdateSoundHistoryUndoUseCase";
import { execute as libraryAreaAddNewMovieClipHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/MovieClip/usecase/LibraryAreaAddNewMovieClipHistoryUndoUseCase";
import { execute as libraryAreaRemoveInstanceHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Instance/usecase/LibraryAreaRemoveInstanceHistoryUndoUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUndoUseCase";
import { execute as layerUpdateLightColorHistoryUndoUseCase } from "@/history/application/core/application/Layer/UpdateLight/usecase/LayerUpdateLightColorHistoryUndoUseCase";
import { execute as layerUpdateModeHistoryUndoUseCase } from "@/history/application/core/application/Layer/UpdateMode/usecase/LayerUpdateModeHistoryUndoUseCase";
import { execute as timelineLayerFrameCreateEmptyKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddEmptyKeyframe/usecase/TimelineLayerFrameCreateEmptyKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameUpdateEmptyKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateEmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameSplitEmptyKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitEmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameInsertEmptyFramesHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertEmptyFrames/usecase/TimelineLayerFrameInsertEmptyFramesHistoryUndoUseCase";
import { execute as timelineLayerFrameAddKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameInsertKeyFramesHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertKeyFrames/usecase/TimelineLayerFrameInsertKeyFramesHistoryUndoUseCase";
import { execute as timelineLayerFrameUpdateKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateKeyframe/usecase/TimelineLayerFrameUpdateKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameSplitKeyframeToKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitKeyframeToKeyframe/usecase/TimelineLayerFrameSplitKeyframeToKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameSplitKeyframeToEmptyHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitKeyframeToEmpty/usecase/TimelineLayerFrameSplitKeyframeToEmptyHistoryUndoUseCase";
import { execute as timelineLayerFrameRemoveEmptyFramesHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveEmptyFrames/usecase/TimelineLayerFrameRemoveEmptyFramesHistoryUndoUseCase";
import { execute as timelineLayerFrameRemoveKeyFramesHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveKeyFrames/usecase/TimelineLayerFrameRemoveKeyFramesHistoryUndoUseCase";
import { execute as timelineLayerFrameEraseEmptyKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseEmptyKeyframe/usecase/TimelineLayerFrameEraseEmptyKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameEraseKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseKeyframe/usecase/TimelineLayerFrameEraseKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameDeleteEmptyKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteEmptyKeyframe/usecase/TimelineLayerFrameDeleteEmptyKeyframeHistoryUndoUseCase";
import { execute as timelineLayerFrameDeleteKeyframeHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteKeyframe/usecase/TimelineLayerFrameDeleteKeyframeHistoryUndoUseCase";
import { execute as soundAreaAddSoundHistoryUndoUseCase } from "@/history/application/controller/application/SoundArea/AddSound/usecase/SoundAreaAddSoundHistoryUndoUseCase";
import { execute as soundAreaRemoveSoundHistoryUndoUseCase } from "@/history/application/controller/application/SoundArea/RemoveSound/usecase/SoundAreaRemoveSoundHistoryUndoUseCase";
import { execute as soundAreaUpdateVolumeHistoryUndoUseCase } from "@/history/application/controller/application/SoundArea/UpdateVolume/usecase/SoundAreaUpdateVolumeHistoryUndoUseCase";
import { execute as soundAreaUpdateLoopCountHistoryUndoUseCase } from "@/history/application/controller/application/SoundArea/UpdateLoopCount/usecase/SoundAreaUpdateLoopCountHistoryUndoUseCase";
import { execute as labelNewRegisterHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/LabelNewRegister/usecase/LabelNewRegisterHistoryUndoUseCase";
import { execute as labelUpdateHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/LabelUpdate/usecase/LabelUpdateHistoryUndoUseCase";
import { execute as labelDeleteHistoryUndoUseCase } from "@/history/application/timeline/application/TimelineTool/LabelDelete/usecase/LabelDeleteHistoryUndoUseCase";
import { execute as stageSettingUpdateWidthHistoryUndoUseCase } from "@/history/application/controller/application/StageSetting/UpdateWidth/usecase/StageSettingUpdateWidthHistoryUndoUseCase";
import { execute as stageSettingUpdateHeightHistoryUndoUseCase } from "@/history/application/controller/application/StageSetting/UpdateHeight/usecacse/StageSettingUpdateHeightHistoryUndoUseCase";
import { execute as stageSettingUpdateFpsHistoryUndoUseCase } from "@/history/application/controller/application/StageSetting/UpdateFPS/usecase/StageSettingUpdateFpsHistoryUndoUseCase";
import { execute as stageSettingUpdateColorHistoryUndoUseCase } from "@/history/application/controller/application/StageSetting/UpdateColor/usecase/StageSettingUpdateColorHistoryUndoUseCase";
import { execute as characterUpdateXHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateX/usecase/CharacterUpdateXHistoryUndoUseCase";
import { execute as characterUpdateYHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateY/usecase/CharacterUpdateYHistoryUndoUseCase";
import { execute as instanceUpdateNameHistoryUndoUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateNameHistoryUndoUseCase";
import { execute as instanceUpdateSymbolHistoryUndoUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateSymbolHistoryUndoUseCase";
import { execute as libraryAreaAddNewShapeHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaAddNewShapeHistoryUndoUseCase";
import { execute as libraryAreaUpdateShapeGraphicsHistoryUndoUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaUpdateShapeGraphicsHistoryUndoUseCase";
import { execute as characterUpdateNameHistoryUndoUseCase } from "@/history/application/core/application/Character/UpdateName/usecase/CharacterUpdateNameHistoryUndoUseCase";
import { execute as characterUpdateScaleXHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateScaleX/usecase/CharacterUpdateScaleXHistoryUndoUseCase";
import { execute as characterUpdateScaleYHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateScaleY/usecase/CharacterUpdateScaleYHistoryUndoUseCase";
import { execute as characterUpdateRotateHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateRotate/usecase/CharacterUpdateRotateHistoryUndoUseCase";
import { execute as characterUpdateMatrixHistoryUndoUseCase } from "@/history/application/controller/application/TransformSetting/UpdateMatrix/usecase/CharacterUpdateMatrixHistoryUndoUseCase";
import { execute as referenceSettingUpdatePivotHistoryUndoUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdatePivot/usecase/ReferenceSettingUpdatePivotHistoryUndoUseCase";
import { execute as referenceSettingUpdateXHistoryUndoUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdateX/usecase/ReferenceSettingUpdateXHistoryUndoUseCase";
import { execute as referenceSettingUpdateYHistoryUndoUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdateY/usecase/ReferenceSettingUpdateYHistoryUndoUseCase";
import { execute as characterUpdateAlphaMultiplierHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateAlphaMultiplier/usecase/CharacterUpdateAlphaMultiplierHistoryUndoUseCase";
import { execute as characterUpdateAlphaOffsetHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateAlphaOffset/usecase/CharacterUpdateAlphaOffsetHistoryUndoUseCase";
import { execute as characterUpdateRedMultiplierHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateRedMultiplier/usecase/CharacterUpdateRedMultiplierHistoryUndoUseCase";
import { execute as characterUpdateRedOffsetHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateRedOffset/usecase/CharacterUpdateRedOffsetHistoryUndoUseCase";
import { execute as characterUpdateGreenMultiplierHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateGreenMultiplier/usecase/CharacterUpdateGreenMultiplierHistoryUndoUseCase";
import { execute as characterUpdateGreenOffsetHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateGreenOffset/usecase/CharacterUpdateGreenOffsetHistoryUndoUseCase";
import { execute as characterUpdateBlueMultiplierHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateBlueMultiplier/usecase/CharacterUpdateBlueMultiplierHistoryUndoUseCase";
import { execute as characterUpdateBlueOffsetHistoryUndoUseCase } from "@/history/application/controller/application/ColorSetting/UpdateBlueOffset/usecase/CharacterUpdateBlueOffsetHistoryUndoUseCase";
import { execute as characterUpdateBlendModeHistoryUndoUseCase } from "@/history/application/controller/application/BlendModeSetting/UpdateBlendMode/usecase/CharacterUpdateBlendModeHistoryUndoUseCase";
import { execute as characterDeleteHistoryUndoUseCase } from "@/history/application/core/application/Character/Delete/usecase/CharacterDeleteHistoryUndoUseCase";
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
    $SOUND_AREA_ADD_SOUND_COMMAND,
    $SOUND_AREA_REMOVE_SOUND_COMMAND,
    $SOUND_AREA_UPDATE_VOLUME_COMMAND,
    $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND,
    $LABEL_NEW_REGISTER_COMMAND,
    $LABEL_UPDATE_COMMAND,
    $LABEL_DELETE_COMMAND,
    $STAGE_WIDTH_COMMAND,
    $STAGE_HEIGHT_COMMAND,
    $STAGE_FPS_COMMAND,
    $STAGE_COLOR_COMMAND,
    $CHARACTER_UPDATE_X_COMMAND,
    $CHARACTER_UPDATE_Y_COMMAND,
    $LIBRARY_ADD_NEW_SHAPE_COMMAND,
    $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND,
    $CHARACTER_UPDATE_NAME_COMMAND,
    $CHARACTER_UPDATE_SCALE_X_COMMAND,
    $CHARACTER_UPDATE_SCALE_Y_COMMAND,
    $CHARACTER_UPDATE_ROTATE_COMMAND,
    $CHARACTER_UPDATE_MATRIX_COMMAND,
    $REFERENCE_UPDATE_PIVOT_COMMAND,
    $REFERENCE_UPDATE_X_COMMAND,
    $REFERENCE_UPDATE_Y_COMMAND,
    $CHARACTER_UPDATE_ALPHA_MULTIPLIER_COMMAND,
    $CHARACTER_UPDATE_ALPHA_OFFSET_COMMAND,
    $CHARACTER_UPDATE_RED_MULTIPLIER_COMMAND,
    $CHARACTER_UPDATE_RED_OFFSET_COMMAND,
    $CHARACTER_UPDATE_GREEN_MULTIPLIER_COMMAND,
    $CHARACTER_UPDATE_GREEN_OFFSET_COMMAND,
    $CHARACTER_UPDATE_BLUE_MULTIPLIER_COMMAND,
    $CHARACTER_UPDATE_BLUE_OFFSET_COMMAND,
    $CHARACTER_UPDATE_BLEND_MODE_COMMAND,
    $CHARACTER_DELETE_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description Undoコマンドの実行関数
 *              Execution function of the Undo command
 *
 * @param  {object} history_object
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    history_object: IHistoryObject
): Promise<void> => {

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
            await screenTabNameAddHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as string  // beforeName
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
            await timelineToolLayerDeleteHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClipId
                messages[2] as number, // Layer Index
                messages[3] as number[], // Child Layer Indexes
                messages[4] as ILayerSaveObject // Layer Object
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
            await instanceUpdateNameHistoryUndoUseCase(
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
                messages[2] as IBitmapSaveObject // Bitmap Save Object
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
            await libraryAreaUpdateBitmapHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as IInstanceSaveObject // Save Object
            );
            break;

        // 動画の追加
        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            libraryAreaAddNewVideoHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as IVideoSaveObject // Video Save Object
            );
            break;

        // 動画の上書き
        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            await libraryAreaUpdateVideoHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as IVideoSaveObject // Video Save Object
            );
            break;

        // 音声の追加
        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            libraryAreaAddNewSoundHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as ISoundSaveObject // Sound Save Object
            );
            break;

        // 音声の上書き
        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            await libraryAreaUpdateSoundHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as ISoundSaveObject // Sound Save Object
            );
            break;

        // MovieClipの追加
        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            libraryAreaAddNewMovieClipHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as number // MovieClip ID
            );
            break;

        // ライブラリのアイテムを削除
        case $LIBRARY_REMOVE_INSTANCE_COMMAND:
            await libraryAreaRemoveInstanceHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[2] as IInstanceSaveObject // save object
            );
            break;

        // レイヤーの移動
        case $TIMELINE_MOVE_LAYER_COMMAND:
            await timelineLayerControllerMoveLayerHistoryUndoUseCase(
                messages[0] as number, // workSpaceId
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Before Index
                messages[3] as number, // After Index
                messages[4] as ILayerMode, // Layer Mode
                messages[6] as number // Layer Parent Index
            );
            break;

        // レイヤーのハイライトカラーの変更
        case $LAYER_UPDATE_LIGHT_COLOR_COMMAND:
            layerUpdateLightColorHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as string // Before Color
            );
            break;

        // レイヤーモードの変更
        case $LAYER_UPDATE_MODE_COMMAND:
            await layerUpdateModeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as ILayerMode, // Before Mode
                messages[5] as number, // Before Parent ID
                messages[7] as number[] // before child layer indexes
            );
            break;

        // 空のキーフレーム追加
        case $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameCreateEmptyKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number // Start Frame
            );
            break;

        // 空のキーフレームの更新
        case $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateEmptyKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[4] as number // before frame
            );
            break;

        // 空のキーフレームの分割
        case $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND:
            timelineLayerFrameSplitEmptyKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[4] as number // NewEmptyCharacter Keyframe
            );
            break;

        // 空のキーフレームへフレームを挿入
        case $TIMELINE_INSERT_EMPTY_FRAME_COMMAND:
            await timelineLayerFrameInsertEmptyFramesHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number // NumFrame
            );
            break;

        // キーフレーム追加
        case $TIMELINE_ADD_KEYFRAME_COMMAND:
            await timelineLayerFrameAddKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as ICharacterSaveObject, // Character Save Object
                messages[4] as number // EmptyCharacter Index
            );
            break;

        // キーフレームへフレームを挿入
        case $TIMELINE_INSERT_KEY_FRAME_COMMAND:
            timelineLayerFrameInsertKeyFramesHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Start Frame
                messages[4] as number // NumFrames
            );
            break;

        // キーフレームの更新
        case $TIMELINE_UPDATE_KEYFRAME_COMMAND:
            await timelineLayerFrameUpdateKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number // Before Frame
            );
            break;

        // キーフレームを分割して空のキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND:
            await timelineLayerFrameSplitKeyframeToEmptyHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // EmptyCharacter Keyframe
                messages[5] as number // Character Keyframe
            );
            break;

        // キーフレームを分割してキーフレームを挿入
        case $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND:
            timelineLayerFrameSplitKeyframeToKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number // Character Keyframe
            );
            break;

        // 空のキーフレームのフレームを削除
        case $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND:
            await timelineLayerFrameRemoveEmptyFramesHistoryUndoUseCase(
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
            await timelineLayerFrameRemoveKeyFramesHistoryUndoUseCase(
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
            await timelineLayerFrameEraseEmptyKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[4] as IEmptyCharacterSaveObject // Save EmptyCharacter Object
            );
            break;

        // キーフレームのフレーム全削除
        case $TIMELINE_ERASE_KEY_FRAME_COMMAND:
            await timelineLayerFrameEraseKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as ICharacterSaveObject[] // Character Save Objects
            );
            break;

        // 空のキーフレームの削除
        case $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteEmptyKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[4] as IEmptyCharacterSaveObject // Save EmptyCharacter Object
            );
            break;

        // キーフレームの削除
        case $TIMELINE_DELETE_KEY_FRAME_COMMAND:
            await timelineLayerFrameDeleteKeyframeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as ICharacterSaveObject[] // Character Save Objects
            );
            break;

        // MovieClipにサウンドを追加
        case $SOUND_AREA_ADD_SOUND_COMMAND:
            await soundAreaAddSoundHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[3] as number, // Frame
                messages[4] as number // Sound Index
            );
            break;

        // MovieClipからサウンドを削除
        case $SOUND_AREA_REMOVE_SOUND_COMMAND:
            await soundAreaRemoveSoundHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as ISoundObject, // Sound Object
                messages[3] as number, // Frame
                messages[4] as number // Sound Index
            );
            break;

        // サウンドの音量更新
        case $SOUND_AREA_UPDATE_VOLUME_COMMAND:
            soundAreaUpdateVolumeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Frame
                messages[3] as number, // Sound Index
                messages[4] as number // Before Volume
            );
            break;

        // サウンドのループ回数更新
        case $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND:
            soundAreaUpdateLoopCountHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Frame
                messages[3] as number, // Sound Index
                messages[4] as number // Before Loop Count
            );
            break;

        // ラベル新規登録
        case $LABEL_NEW_REGISTER_COMMAND:
            labelNewRegisterHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number // Frame
            );
            break;

        // ラベルの変更
        case $LABEL_UPDATE_COMMAND:
            labelUpdateHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Frame
                messages[3] as string // Before Label
            );
            break;

        // ラベルの削除
        case $LABEL_DELETE_COMMAND:
            labelDeleteHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Frame
                messages[3] as string // Before Label
            );
            break;

        // ステージの幅を更新
        case $STAGE_WIDTH_COMMAND:
            stageSettingUpdateWidthHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as number // Before Width
            );
            break;

        // ステージの高さを更新
        case $STAGE_HEIGHT_COMMAND:
            stageSettingUpdateHeightHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as number // Before Height
            );
            break;

        // ステージのFPSを更新
        case $STAGE_FPS_COMMAND:
            stageSettingUpdateFpsHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as number // Before FPS
            );
            break;

        // ステージの背景色を更新
        case $STAGE_COLOR_COMMAND:
            stageSettingUpdateColorHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as string // Before Color
            );
            break;

        // DisplayObjectのX座標を更新
        case $CHARACTER_UPDATE_X_COMMAND:
            await characterUpdateXHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number // Before X
            );
            break;

        // DisplayObjectのY座標を更新
        case $CHARACTER_UPDATE_Y_COMMAND:
            await characterUpdateYHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number // Before Y
            );
            break;

        // 新規Shape追加
        case $LIBRARY_ADD_NEW_SHAPE_COMMAND:
            libraryAreaAddNewShapeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as IShapeSaveObject // Shape Save Object
            );
            break;

        // Shapeのグラフィックスを更新
        case $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND:
            await libraryAreaUpdateShapeGraphicsHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[2] as IShapeSaveObject // Shape Save Object
            );
            break;

        // DisplayObjectの名前を更新
        case $CHARACTER_UPDATE_NAME_COMMAND:
            characterUpdateNameHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as string  // Before Name
            );
            break;

        // DisplayObjectのスケールXを更新
        case $CHARACTER_UPDATE_SCALE_X_COMMAND:
            await characterUpdateScaleXHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before ScaleX
            );
            break;

        // DisplayObjectのスケールYを更新
        case $CHARACTER_UPDATE_SCALE_Y_COMMAND:
            await characterUpdateScaleYHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before ScaleY
            );
            break;

        // DisplayObjectの回転を更新
        case $CHARACTER_UPDATE_ROTATE_COMMAND:
            await characterUpdateRotateHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Rotation
            );
            break;

        case $CHARACTER_UPDATE_MATRIX_COMMAND:
            await characterUpdateMatrixHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number[] // Before Matrix
            );
            break;

        case $REFERENCE_UPDATE_PIVOT_COMMAND:
            await referenceSettingUpdatePivotHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as Array<[number, number[]]>, // Depth
                messages[6] as IPivotType // Before Matrix
            );
            break;

        case $REFERENCE_UPDATE_X_COMMAND:
            await referenceSettingUpdateXHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as Array<[number, number[]]>, // Depth
                messages[6] as number, // Before X
                messages[9] as number, // Before Y
                messages[8] as IPivotType // Before Pivot
            );
            break;

        case $REFERENCE_UPDATE_Y_COMMAND:
            await referenceSettingUpdateYHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as Array<[number, number[]]>, // Depth
                messages[6] as number, // Before Y
                messages[9] as number, // Before X
                messages[8] as IPivotType // Before Pivot
            );
            break;

        case $CHARACTER_UPDATE_ALPHA_MULTIPLIER_COMMAND:
            await characterUpdateAlphaMultiplierHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Alpha Multiplier
            );
            break;

        case $CHARACTER_UPDATE_ALPHA_OFFSET_COMMAND:
            await characterUpdateAlphaOffsetHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Alpha Offset
            );
            break;

        case $CHARACTER_UPDATE_RED_MULTIPLIER_COMMAND:
            await characterUpdateRedMultiplierHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Red Multiplier
            );
            break;

        case $CHARACTER_UPDATE_RED_OFFSET_COMMAND:
            await characterUpdateRedOffsetHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Red Offset
            );
            break;

        case $CHARACTER_UPDATE_GREEN_MULTIPLIER_COMMAND:
            await characterUpdateGreenMultiplierHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Green Multiplier
            );
            break;

        case $CHARACTER_UPDATE_GREEN_OFFSET_COMMAND:
            await characterUpdateGreenOffsetHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Green Offset
            );
            break;

        case $CHARACTER_UPDATE_BLUE_MULTIPLIER_COMMAND:
            await characterUpdateBlueMultiplierHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Blue Multiplier
            );
            break;

        case $CHARACTER_UPDATE_BLUE_OFFSET_COMMAND:
            await characterUpdateBlueOffsetHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as number  // Before Blue Offset
            );
            break;

        case $CHARACTER_UPDATE_BLEND_MODE_COMMAND:
            await characterUpdateBlendModeHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[4] as number, // Depth
                messages[5] as IBlendMode  // Before BlendMode
            );
            break;

        case $CHARACTER_DELETE_COMMAND:
            await characterDeleteHistoryUndoUseCase(
                messages[0] as number, // WorkSpace ID
                messages[1] as number, // MovieClip ID
                messages[2] as number, // Layer Index
                messages[3] as number, // Keyframe
                messages[5] as ICharacterSaveObject // Character Save Object
            );
            break;

        default:
            break;

    }
};