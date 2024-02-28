import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { $LIBRARY_OVERWRITE_SOUND_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 音声データ上書き履歴用オブジェクトを作成
 *              Create object for voice data overwrite history
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} before_object
 * @param  {object} after_object
 * @param  {string} fileId
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    before_object: SoundSaveObjectImpl,
    after_object: SoundSaveObjectImpl,
    fileId: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_OVERWRITE_SOUND_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            before_object,
            after_object,
            fileId
        ],
        "args": [
            before_object.name
        ]
    };
};