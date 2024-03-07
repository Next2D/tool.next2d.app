import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import { $LIBRARY_OVERWRITE_SOUND_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 音声データ上書き履歴用オブジェクトを作成
 *              Create object for voice data overwrite history
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} before_save_object
 * @param  {object} after_save_object
 * @param  {string} [file_id = ""]
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    before_save_object: InstanceSaveObjectImpl,
    after_save_object: SoundSaveObjectImpl,
    file_id: string = ""
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_OVERWRITE_SOUND_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            before_save_object,
            after_save_object,
            file_id
        ],
        "args": [
            before_save_object.name
        ]
    };
};