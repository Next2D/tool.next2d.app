import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LABEL_DELETE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ラベルの削除履歴用オブジェクトを作成
 *              Create a history object for deleting labels
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} before_label
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    frame: number,
    before_label: string
): IHistoryObject => {

    return {
        "command": $LABEL_DELETE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            before_label
        ],
        "args": [
            movie_clip.name,
            frame
        ]
    };
};