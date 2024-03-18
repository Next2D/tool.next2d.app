import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { AllSaveObjectImpl } from "@/interface/AllSaveObjectImpl";
import { $LIBRARY_REMOVE_INSTANCE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} instance_object
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    instance_object: AllSaveObjectImpl
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_REMOVE_INSTANCE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            instance_object
        ],
        "args": [
            instance_object.name
        ]
    };
};