import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description スクリプトの変更履歴用オブジェクトを作成
 *              Create object for script changelog
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} before_script
 * @param  {string} after_script
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    frame: number,
    before_script: string,
    after_script: string
): HistoryObjectImpl => {

    return {
        "command": $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            before_script,
            after_script
        ],
        "args": [
            movie_clip.name,
            frame
        ]
    };
};