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
 * @description タイムラインの指定したフレームへのスクリプト追加履歴の識別コマンド名
 *              Identifying command name for the history of script additions to the specified frame of the timeline
 *
 * @type {string}
 * @constant
 */
export const $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND: string = "timieline_tool_script_new_register";