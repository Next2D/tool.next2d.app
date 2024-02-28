import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { $LIBRARY_ADD_NEW_SOUND_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 音声データ追加の履歴用オブジェクトを作成
 *              Create object for history of voice data addition
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} sound_object
 * @param  {string} fileId
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    sound_object: SoundSaveObjectImpl,
    fileId: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_SOUND_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            sound_object,
            fileId
        ],
        "args": [
            sound_object.name
        ]
    };
};