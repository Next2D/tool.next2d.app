import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import { $LIBRARY_ADD_NEW_BITMAP_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {Bitmap} bitmap
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    bitmap: Bitmap
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_BITMAP_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            bitmap.toObject()
        ],
        "args": [
            bitmap.name
        ]
    };
};