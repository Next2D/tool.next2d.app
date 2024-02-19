import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description スクリプトの変更履歴用オブジェクトを作成
 *              Create object for script changelog
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} frame
 * @param  {string} before_script
 * @param  {string} after_script
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    frame: number,
    before_script: string,
    after_script: string
): HistoryObjectImpl => {

    return {
        "command": $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            frame,
            before_script,
            after_script
        ],
        "args": []
    };
};