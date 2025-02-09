import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { ISoundObject } from "@/interface/ISoundObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SOUND_AREA_REMOVE_SOUND_COMMAND } from "@/config/HistoryConfig";

/**
 * @description MovieClipへのサウンド削除の履歴用オブジェクトを作成
 *              Create a history object for removing sound to MovieClip
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {number} sound_index
 * @param  {object} sound_object
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    sound_object: ISoundObject,
    frame: number,
    sound_index: number,
    name: string
): IHistoryObject => {

    return {
        "command": $SOUND_AREA_REMOVE_SOUND_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            sound_object,
            frame,
            sound_index
        ],
        "args": [
            movie_clip.name,
            frame,
            name
        ]
    };
};