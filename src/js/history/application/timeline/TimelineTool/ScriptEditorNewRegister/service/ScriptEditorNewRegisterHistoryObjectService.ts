import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description スクリプトの新規追加履歴用オブジェクトを作成
 *              Create object for history of newly added scripts
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} frame
 * @param  {string} script
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    frame: number,
    script: string
): HistoryObjectImpl => {

    return {
        "command": $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            frame,
            script
        ],
        "args": []
    };
};