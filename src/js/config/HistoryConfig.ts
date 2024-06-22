/**
 * @description MovieClipの作業履歴の最大値
 *              Maximum MovieClip work history
 *
 * @type {number}
 * @constant
 */
export const $HISTORY_LIMIT: number = 100;

/**
 * @description 履歴エリアのElement IDの名前
 *              Name of Element ID in history area
 *
 * @type {string}
 * @public
 */
export const $HISTORY_LIST_PARENT_ID: string = "history-list";

/**
 * @description 履歴エリアのElement IDの名前
 *              Name of Element ID in history area
 *
 * @type {string}
 * @public
 */
export const $HISTORY_LIST_ID: string = "history-list-body";

/**
 * @description 履歴エリアのスクロールElement IDの名前
 *              Name of Element ID in scroll of history area
 *
 * @type {string}
 * @public
 */
export const $HISTORY_LIST_SCROLL_BAR_ID: string = "history-list-scroll-bar";

/**
 * @description 履歴エリアのスクロールエリアElement IDの名前
 *              Name of Element ID in scroll area of history area
 *
 * @type {string}
 * @public
 */
export const $HISTORY_LIST_SCROLL_AREA_ID: string = "history-list-scroll-area";

/**
 * @description タイムラインへ新規レイヤーした際の履歴の識別コマンド名
 *              Identification command name of the history when newly layered on the timeline.
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_TOOL_LAYER_ADD_COMMAND: number = 0;

/**
 * @description タイムラインの指定したレイヤー削除履歴の識別コマンド名
 *              Identifying command name for the specified layer deletion history in the timeline
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_TOOL_LAYER_DELETE_COMMAND: number = 1;

/**
 * @description スクリプト追加履歴の識別コマンド名
 *              Script addition history identification command name
 *
 * @type {number}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND: number = 2;

/**
 * @description スクリプト変更履歴の識別コマンド名
 *              Script Change History Identification Command Name
 *
 * @type {number}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND: number = 3;

/**
 * @description スクリプト削除履歴の識別コマンド名
 *              Script deletion history identification command name
 *
 * @type {number}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND: number = 4;

/**
 * @description Undoの識別コマンド名
 *              Identification command name for Undo
 *
 * @type {number}
 * @constant
 */
export const $HISTORY_UNDO_COMMAND: number = 5;

/**
 * @description Redoの識別コマンド名
 *              Identification command name for Redo
 *
 * @type {number}
 * @constant
 */
export const $HISTORY_REDO_COMMAND: number = 6;

/**
 * @description プロジェクト名の更新履歴の識別コマンド名
 *              Project Name Update History Identification Command Name
 *
 * @type {number}
 * @constant
 */
export const $SCREEN_TAB_NAME_UPDATE_COMMAND: number = 7;

/**
 * @description レイヤー名の更新履歴の識別コマンド名
 *              Layer Name Update History Identification Command Name
 *
 * @type {number}
 * @constant
 */
export const $LAYER_NAME_UPDATE_COMMAND: number = 8;

/**
 * @description レイヤーのロック操作の識別コマンド名
 *              Identifying command name for layer lock operation
 *
 * @type {number}
 * @constant
 */
export const $LAYER_LOCK_UPDATE_COMMAND: number = 9;

/**
 * @description レイヤーの表示操作の識別コマンド名
 *              Identifying command name for layer display operation
 *
 * @type {number}
 * @constant
 */
export const $LAYER_DISABLE_UPDATE_COMMAND: number = 10;

/**
 * @description レイヤーのハイライト操作の識別コマンド名
 *              Identifying command name for layer highlighting operations
 *
 * @type {number}
 * @constant
 */
export const $LAYER_LIGHT_UPDATE_COMMAND: number = 11;

/**
 * @description 新規フォルダ追加操作の識別コマンド名
 *              Identification command name for new folder add operation
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_ADD_NEW_FOLDER_COMMAND: number = 12;

/**
 * @description フォルダ開閉状態の識別コマンド名
 *              Folder open/close status identification command name
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_FOLDER_STATE_COMMAND: number = 13;

/**
 * @description インスタンス名更新の識別コマンド名
 *              Identification command name for instance name update
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND: number = 14;

/**
 * @description インスタンスのシンボル名更新の識別コマンド名
 *              Identification command name of instance symbol name update
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND: number = 15;

/**
 * @description 新規bitmap追加操作の識別コマンド名
 *              Identification command name for new bitmap add operation
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_ADD_NEW_BITMAP_COMMAND: number = 16;

/**
 * @description フォルダ移動の識別コマンド名
 *              Identification command name for folder move
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_MOVE_FOLDER_COMMAND: number = 17;

/**
 * @description 画像の上書きの識別コマンド名
 *              Identification command name of image overwrite
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_OVERWRITE_IMAGE_COMMAND: number = 18;

/**
 * @description 新規video追加操作の識別コマンド名
 *              Identification command name for new video add operation
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_ADD_NEW_VIDEO_COMMAND: number = 19;

/**
 * @description 動画の上書きの識別コマンド名
 *              Identification command name of video overwrite
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_OVERWRITE_VIDEO_COMMAND: number = 20;

/**
 * @description 新規audio追加操作の識別コマンド名
 *              Identification command name for new audio add operation
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_ADD_NEW_SOUND_COMMAND: number = 21;

/**
 * @description 音声の上書きの識別コマンド名
 *              Identification command name for voice override
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_OVERWRITE_SOUND_COMMAND: number = 22;

/**
 * @description 新規MovieClip追加操作の識別コマンド名
 *              Identification command name for new MovieClip add operation
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND: number = 23;

/**
 * @description ライブラリのインスタンス削除の識別コマンド名
 *              Identification command name for deletion of library instances
 *
 * @type {number}
 * @constant
 */
export const $LIBRARY_REMOVE_INSTANCE_COMMAND: number = 24;

/**
 * @description タイムラインのレイヤー移動の識別コマンド名
 *              Identification command name for layer movement in the timeline
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_MOVE_LAYER_COMMAND: number = 25;

/**
 * @description レイヤーのハイライトカラー値の更新の識別コマンド名
 *              Identification command name for updating the highlight color value of the layer
 *
 * @type {number}
 * @constant
 */
export const $LAYER_UPDATE_LIGHT_COLOR_COMMAND: number = 26;

/**
 * @description レイヤーモードの更新の識別コマンド名
 *              Identification command name for updating the layer mode
 *
 * @type {number}
 * @constant
 */
export const $LAYER_UPDATE_MODE_COMMAND: number = 27;

/**
 * @description 空のキーフレーム追加の識別コマンド名
 *              Identification command name for adding an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND: number = 28;

/**
 * @description 空のキーフレーム更新の識別コマンド名
 *              Identification command name for updating an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_UPDATE_EMPTY_KEYFRAME_COMMAND: number = 29;

/**
 * @description 空のキーフレームの分割の識別コマンド名
 *              Identification command name for splitting an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND: number = 30;

/**
 * @description 空のキーフレームへフレームへの追加の識別コマンド名
 *              Identification command name for adding frames to an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_INSERT_EMPTY_FRAME_COMMAND: number = 31;

/**
 * @description キーフレーム追加の識別コマンド名
 *              Identification command name for adding a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_ADD_KEYFRAME_COMMAND: number = 32;

/**
 * @description キーフレームへフレームへの追加の識別コマンド名
 *              Identification command name for adding frames to a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_INSERT_KEY_FRAME_COMMAND: number = 33;

/**
 * @description キーフレーム更新の識別コマンド名
 *              Identification command name for updating a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_UPDATE_KEYFRAME_COMMAND: number = 34;

/**
 * @description キーフレームの分割して空のキーフレームを挿入の識別コマンド名
 *              Identification command name for splitting keyframes and inserting empty keyframes
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND: number = 35;

/**
 * @description キーフレームの分割してキーフレームを挿入の識別コマンド名
 *              Identification command name for splitting keyframes and inserting keyframes
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_SPLIT_KEYFRAME_TO_KEYFRAME_COMMAND: number = 36;

/**
 * @description 空のキーフレームのフレーム削除の識別コマンド名
 *              Identification command name for deleting frames from an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND: number = 37;

/**
 * @description キーフレームのフレーム削除の識別コマンド名
 *              Identification command name for deleting frames from a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_REMOVE_KEY_FRAMES_COMMAND: number = 38;

/**
 * @description 空のキーフレームのフレーム全削除の識別コマンド名
 *              Identification command name for deleting all frames from an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND: number = 39;

/**
 * @description キーフレームのフレーム全削除の識別コマンド名
 *              Identification command name for deleting all frames from a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_ERASE_KEY_FRAME_COMMAND: number = 40;

/**
 * @description 空のキーフレーム削除の識別コマンド名
 *              Identification command name for deleting an empty keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_DELETE_EMPTY_KEY_FRAME_COMMAND: number = 41;

/**
 * @description キーフレーム削除の識別コマンド名
 *              Identification command name for deleting a keyframe
 *
 * @type {number}
 * @constant
 */
export const $TIMELINE_DELETE_KEY_FRAME_COMMAND: number = 42;

/**
 * @description MovieClipへのサウンド追加の識別コマンド名
 *              Identification command name for adding sound to a MovieClip
 *
 * @type {number}
 * @constant
 */
export const $SOUND_AREA_ADD_SOUND_COMMAND: number = 43;

/**
 * @description MovieClipへのサウンド削除の識別コマンド名
 *              Identification command name for deleting sound from a MovieClip
 *
 * @type {number}
 * @constant
 */
export const $SOUND_AREA_REMOVE_SOUND_COMMAND: number = 44;

/**
 * @description 個別の音量調整の識別コマンド名
 *              Identification command name for individual volume adjustment
 *
 * @type {number}
 * @constant
 */
export const $SOUND_AREA_UPDATE_VOLUME_COMMAND: number = 45;

/**
 * @description 個別のループ回数調整の識別コマンド名
 *              Identification command name for individual loop count adjustment
 *
 * @type {number}
 * @constant
 */
export const $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND: number = 46;

/**
 * @description ラベル追加履歴の識別コマンド名
 *              Identification command name for label addition history
 *
 * @type {number}
 * @constant
 */
export const $LABEL_NEW_REGISTER_COMMAND: number = 47;

/**
 * @description ラベル変更履歴の識別コマンド名
 *              Identification command name for label change history
 *
 * @type {number}
 * @constant
 */
export const $LABEL_UPDATE_COMMAND: number = 48;

/**
 * @description ラベル削除履歴の識別コマンド名
 *              Identification command name for label deletion history
 *
 * @type {number}
 * @constant
 */
export const $LABEL_DELETE_COMMAND: number = 49;

/**
 * @description ステージの幅更新の識別コマンド名
 *              Identification command name for stage width update
 *
 * @type {number}
 * @constant
 */
export const $STAGE_WIDTH_COMMAND: number = 50;

/**
 * @description ステージの高さ更新の識別コマンド名
 *              Identification command name for stage height update
 *
 * @type {number}
 * @constant
 */
export const $STAGE_HEIGHT_COMMAND: number = 51;

/**
 * @description ステージのフレームレート更新の識別コマンド名
 *              Identification command name for stage frame rate update
 *
 * @type {number}
 * @constant
 */
export const $STAGE_FPS_COMMAND: number = 52;

/**
 * @description ステージの背景色更新の識別コマンド名
 *              Identification command name for stage background color update
 *
 * @type {number}
 * @constant
 */
export const $STAGE_COLOR_COMMAND: number = 53;

/**
 * @description DisplayObjectのx座標更新の識別コマンド名
 *              Identification command name for updating the x-coordinate of the DisplayObject
 *
 * @type {number}
 * @constant
 */
export const $CHARACTER_UPDATE_X: number = 54;

/**
 * @description DisplayObjectのy座標更新の識別コマンド名
 *              Identification command name for updating the y-coordinate of the DisplayObject
 *
 * @type {number}
 * @constant
 */
export const $CHARACTER_UPDATE_Y: number = 55;