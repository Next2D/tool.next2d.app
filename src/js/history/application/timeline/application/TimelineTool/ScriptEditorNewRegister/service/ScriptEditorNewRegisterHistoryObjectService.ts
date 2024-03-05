import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description スクリプトの新規追加履歴用オブジェクトを作成
 *              Create object for history of newly added scripts
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} script
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    frame: number,
    script: string
): HistoryObjectImpl => {

    return {
        "command": $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            script
        ],
        "args": [
            movie_clip.name,
            frame
        ]
    };
};