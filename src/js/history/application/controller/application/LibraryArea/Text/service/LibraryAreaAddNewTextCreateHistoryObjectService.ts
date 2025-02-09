import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { TextSaveObjectImpl } from "@/interface/TextSaveObjectImpl";
import { $LIBRARY_ADD_NEW_TEXT_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規Text追加の履歴用オブジェクトを作成
 *              Create object for history of adding new Text
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} text_object
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    text_object: TextSaveObjectImpl
): IHistoryObject => {

    return {
        "command": $LIBRARY_ADD_NEW_TEXT_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            text_object
        ],
        "args": [
            text_object.name
        ]
    };
};