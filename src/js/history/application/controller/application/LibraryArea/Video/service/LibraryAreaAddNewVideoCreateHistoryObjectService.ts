import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { $LIBRARY_ADD_NEW_VIDEO_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 映像データ追加の履歴用オブジェクトを作成
 *              Create object for history of image data addition
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} video_object
 * @param  {string} fileId
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    video_object: VideoSaveObjectImpl,
    fileId: string
): IHistoryObject => {

    return {
        "command": $LIBRARY_ADD_NEW_VIDEO_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            video_object,
            fileId
        ],
        "args": [
            video_object.name
        ]
    };
};