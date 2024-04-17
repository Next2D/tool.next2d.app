import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND } from "@/config/HistoryConfig";

/**
 * @description MovieClipへのサウンド追加の履歴用オブジェクトを作成
 *              Create a history object for adding sound to MovieClip
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
    frame: number,
    sound_index: number,
    sound_object: SoundObjectImpl,
    name: string
): HistoryObjectImpl => {

    return {
        "command": $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            sound_index,
            sound_object
        ],
        "args": [
            movie_clip.name,
            frame,
            name
        ]
    };
};