import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LABEL_UPDATE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ラベルの変更履歴用オブジェクトを作成
 *              Create an object for the label change history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} before_label
 * @param  {string} after_label
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    frame: number,
    before_label: string,
    after_label: string
): IHistoryObject => {

    return {
        "command": $LABEL_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            before_label,
            after_label
        ],
        "args": [
            movie_clip.name,
            frame,
            before_label,
            after_label
        ]
    };
};