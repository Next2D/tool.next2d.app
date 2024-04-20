import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 個別のループ回数の履歴用オブジェクトを作成
 *              Create a history object for individual loop count
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
    sound_object: SoundObjectImpl,
    frame: number,
    sound_index: number,
    before_loop_count: number,
    name: string
): HistoryObjectImpl => {

    return {
        "command": $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            sound_index,
            before_loop_count,
            sound_object.loopCount
        ],
        "args": [
            movie_clip.name,
            frame,
            name,
            before_loop_count,
            sound_object.loopCount
        ]
    };
};