import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { $LIBRARY_ADD_NEW_BITMAP_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 画像データ追加の履歴用オブジェクトを作成
 *              Create object for history of image data addition
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} bitmap_object
 * @param  {string} [file_id = ""]
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    bitmap_object: BitmapSaveObjectImpl,
    file_id: string = ""
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_BITMAP_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            bitmap_object,
            file_id
        ],
        "args": [
            bitmap_object.name
        ]
    };
};