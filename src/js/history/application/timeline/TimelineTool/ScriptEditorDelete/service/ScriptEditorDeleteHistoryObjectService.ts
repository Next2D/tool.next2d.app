import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description スクリプトの削除履歴用オブジェクトを作成
 *              Create object for script deletion history
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} frame
 * @param  {string} before_script
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    frame: number,
    before_script: string
): HistoryObjectImpl => {

    return {
        "command": $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            frame,
            before_script
        ],
        "args": [frame]
    };
};