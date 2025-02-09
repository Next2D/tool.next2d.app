import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LABEL_NEW_REGISTER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ラベルの新規追加履歴用オブジェクトを作成
 *              Create a new label addition history object
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} label
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    frame: number,
    label: string
): IHistoryObject => {

    return {
        "command": $LABEL_NEW_REGISTER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            label
        ],
        "args": [
            movie_clip.name,
            frame,
            label
        ]
    };
};