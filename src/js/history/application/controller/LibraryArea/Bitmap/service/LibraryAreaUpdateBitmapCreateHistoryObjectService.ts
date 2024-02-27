import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { $LIBRARY_OVERWRITE_IMAGE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 画像データ上書き履歴用オブジェクトを作成
 *              Create object for image data overwrite history
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
    before_object: BitmapSaveObjectImpl,
    after_object: BitmapSaveObjectImpl,
    fileId: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_OVERWRITE_IMAGE_COMMAND,
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