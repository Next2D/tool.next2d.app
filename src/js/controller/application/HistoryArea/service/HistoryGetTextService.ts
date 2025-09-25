import {
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
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
    $LIBRARY_ADD_NEW_TEXT_COMMAND,
    $CHARACTER_UPDATE_NAME_COMMAND,
    $CHARACTER_UPDATE_SCALE_X_COMMAND,
    $CHARACTER_UPDATE_SCALE_Y_COMMAND,
    $CHARACTER_UPDATE_ROTATE_COMMAND,
    $CHARACTER_UPDATE_MATRIX_COMMAND,
    $REFERENCE_UPDATE_PIVOT_COMMAND,
    $REFERENCE_UPDATE_X_COMMAND,
    $REFERENCE_UPDATE_Y_COMMAND
} from "@/config/HistoryConfig";

/**
 * @description 作業履歴のテキスト情報をコマンド名から識別して返却
 *              Identifies and returns work history text information from command names
 *
 * @return {number}
 * @method
 * @public
 */
export const execute = (command: number): string =>
{
    switch (command) {

        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            return "「%s1」にレイヤー「%s2」を追加";

        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            return "「%s1」のレイヤー「%s2」を削除";

        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            return "「%s1」の%s2フレームにスクリプトを追加";

        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            return "「%s1」の%s2フレームのスクリプトを変更";

        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            return "「%s1」の%s2フレームのスクリプトを削除";

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            return "プロジェクト名「%s1」を「%s2」に変更";

        case $LAYER_NAME_UPDATE_COMMAND:
            return "「%s1」のレイヤー名「%s2」を「%s3」に変更";

        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            return "新規フォルダー「%s1」を追加";

        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            return "「%s1」の名前を「%s2」に変更";

        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            return "「%s1」のシンボル名を「%s2」に変更";

        case $LIBRARY_MOVE_FOLDER_COMMAND:
            return "「%s1」のフォルダ移動";

        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            return "画像「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            return "「%s1」を画像に上書き";

        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            return "動画「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            return "「%s1」を動画に上書き";

        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            return "音声「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            return "「%s1」を音声に上書き";

        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            return "新規MovieClip「%s1」を追加";

        case $LIBRARY_REMOVE_INSTANCE_COMMAND:
            return "ライブラリから「%s1」を削除";

        case $TIMELINE_MOVE_LAYER_COMMAND:
            return "「%s1」のレイヤー「%s2」を移動";

        case $LAYER_UPDATE_LIGHT_COLOR_COMMAND:
            return "「%s1」のレイヤー「%s2」のハイライトカラーを変更";

        case $LAYER_UPDATE_MODE_COMMAND:
            return "「%s1」のレイヤー「%s2」を「%s3」に変更";

        case $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームに空のキーフレームを追加";

        case $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームの空のキーフレームに%s4フレームを追加";

        case $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームの空のキーフレームを分割";

        case $TIMELINE_INSERT_EMPTY_FRAME_COMMAND:
        case $TIMELINE_INSERT_KEY_FRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム目に%s4フレームを追加";

        case $TIMELINE_ADD_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームに「%s4」を追加";

        case $TIMELINE_UPDATE_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームのキーフレームに%s4フレームを追加";

        case $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND:
        case $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームのキーフレームを分割";

        case $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームの空のキーフレームから%s4フレーム削除";

        case $TIMELINE_REMOVE_KEY_FRAMES_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームのキーフレームから%s4フレーム削除";

        case $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームの空のキーフレームを全て削除";

        case $TIMELINE_ERASE_KEY_FRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームのキーフレームを全て削除";

        case $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームの空のキーフレームを削除";

        case $TIMELINE_DELETE_KEY_FRAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレームのキーフレームを削除";

        case $SOUND_AREA_ADD_SOUND_COMMAND:
            return "「%s1」の%s2フレームにサウンド「%s3」を追加";

        case $SOUND_AREA_REMOVE_SOUND_COMMAND:
            return "「%s1」の%s2フレームのサウンド「%s3」を削除";

        case $SOUND_AREA_UPDATE_VOLUME_COMMAND:
            return "「%s1」の%s2フレームのサウンド「%s3」の音量を%s4から%s5に変更";

        case $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND:
            return "「%s1」の%s2フレームのサウンド「%s3」のループ回数を%s4から%s5に変更";

        case $LABEL_NEW_REGISTER_COMMAND:
            return "「%s1」の%s2フレームにラベル「%s3」を登録";

        case $LABEL_UPDATE_COMMAND:
            return "「%s1」の%s2フレームのラベル「%s3」を「%s4」に変更";

        case $LABEL_DELETE_COMMAND:
            return "「%s1」の%s2フレームのラベルを削除";

        case $STAGE_WIDTH_COMMAND:
            return "ステージの幅を%s1から%s2に変更";

        case $STAGE_HEIGHT_COMMAND:
            return "ステージの高さを%s1から%s2に変更";

        case $STAGE_FPS_COMMAND:
            return "ステージのFPSを%s1から%s2に変更";

        case $STAGE_COLOR_COMMAND:
            return "ステージの背景色を「%s1」から「%s2」に変更";

        case $CHARACTER_UPDATE_X_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4のx座標を%s5から%s6に変更";

        case $CHARACTER_UPDATE_Y_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4のy座標を%s5から%s6に変更";

        case $LIBRARY_ADD_NEW_SHAPE_COMMAND:
            return "新規Shape「%s1」を追加";

        case $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND:
            return "「%s1」のグラフィックを変更";

        case $LIBRARY_ADD_NEW_TEXT_COMMAND:
            return "新規Text「%s1」を追加";

        case $CHARACTER_UPDATE_NAME_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の名前を%s5に変更";

        case $CHARACTER_UPDATE_SCALE_X_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4のxスケールを%s5%から%s6%に変更";

        case $CHARACTER_UPDATE_SCALE_Y_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4のyスケールを%s5%から%s6%に変更";

        case $CHARACTER_UPDATE_ROTATE_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の回転を%s5°から%s6°に変更";

        case $CHARACTER_UPDATE_MATRIX_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の行列を%s5°から%s6°に変更";

        case $REFERENCE_UPDATE_PIVOT_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の中心点を「%s5」から「%s6」に変更";

        case $REFERENCE_UPDATE_X_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の中心点のx座標を%s5から%s6に変更";

        case $REFERENCE_UPDATE_Y_COMMAND:
            return "「%s1」のレイヤー「%s2」の%s3フレーム・深度%s4の中心点のy座標を%s5から%s6に変更";

        default:
            break;

    }

    return "";
};