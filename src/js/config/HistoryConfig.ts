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
 * @type {string}
 * @constant
 */
export const $TIMELINE_TOOL_LAYER_ADD_COMMAND: string = "timieline_tool_layer_add";

/**
 * @description タイムラインの指定したレイヤー削除履歴の識別コマンド名
 *              Identifying command name for the specified layer deletion history in the timeline
 *
 * @type {string}
 * @constant
 */
export const $TIMELINE_TOOL_LAYER_DELETE_COMMAND: string = "timieline_tool_layer_delete";

/**
 * @description スクリプト追加履歴の識別コマンド名
 *              Script addition history identification command name
 *
 * @type {string}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND: string = "timieline_tool_script_new_register";

/**
 * @description スクリプト変更履歴の識別コマンド名
 *              Script Change History Identification Command Name
 *
 * @type {string}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND: string = "timieline_tool_script_update";

/**
 * @description スクリプト削除履歴の識別コマンド名
 *              Script deletion history identification command name
 *
 * @type {string}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND: string = "timieline_tool_script_delete";

/**
 * @description Undoの識別コマンド名
 *              Identification command name for Undo
 *
 * @type {string}
 * @constant
 */
export const $HISTORY_UNDO_COMMAND: string = "history_undo";

/**
 * @description Redoの識別コマンド名
 *              Identification command name for Redo
 *
 * @type {string}
 * @constant
 */
export const $HISTORY_REDO_COMMAND: string = "history_redo";

/**
 * @description プロジェクト名の更新履歴の識別コマンド名
 *              Project Name Update History Identification Command Name
 *
 * @type {string}
 * @constant
 */
export const $SCREEN_TAB_NAME_UPDATE_COMMAND: string = "screen_tab_name_update";