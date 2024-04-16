import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {object} sound
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    sound_index: number,
    sound: SoundObjectImpl,
    name: string
): HistoryObjectImpl => {

    return {
        "command": $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            sound_index,
            sound
        ],
        "args": [
            movie_clip.name,
            movie_clip.currentFrame,
            name
        ]
    };
};