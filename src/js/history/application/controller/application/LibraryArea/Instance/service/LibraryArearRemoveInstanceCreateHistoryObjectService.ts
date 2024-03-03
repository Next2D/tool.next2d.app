import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import { $LIBRARY_REMOVE_INSTANCE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} instance_object
 * @param  {string} file_id
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    instance_object: MovieClipSaveObjectImpl | VideoSaveObjectImpl | BitmapSaveObjectImpl | SoundSaveObjectImpl,
    file_id: string = ""
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_REMOVE_INSTANCE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            instance_object,
            file_id
        ],
        "args": [
            instance_object.name
        ]
    };
};