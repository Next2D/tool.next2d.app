import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { ISoundObject } from "@/interface/ISoundObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SOUND_AREA_UPDATE_VOLUME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 個別の音量調整の履歴用オブジェクトを作成
 *              Create a history object for individual volume adjustment
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
    before_volume: number,
    name: string
): IHistoryObject => {

    return {
        "command": $SOUND_AREA_UPDATE_VOLUME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            frame,
            sound_index,
            before_volume,
            sound_object.volume
        ],
        "args": [
            movie_clip.name,
            frame,
            name,
            before_volume,
            sound_object.volume
        ]
    };
};