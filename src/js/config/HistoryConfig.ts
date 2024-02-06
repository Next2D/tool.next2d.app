/**
 * @description MovieClipの作業履歴の最大値
 *              Maximum MovieClip work history
 *
 * @type {number}
 * @constant
 */
export const $HISTORY_LIMIT: number = 100;

/**
 * @description コントローラーエリアのElement IDの名前
 *              Name of the Element ID in the controller area
 *
 * @type {string}
 * @public
 */
export const $HISTORY_LIST_ID: string = "history-list";

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