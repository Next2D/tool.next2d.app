import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Video } from "@/core/domain/model/Video";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 上書き前の状態のvideoに戻す
 *              Restore the video to its pre-write state
 *
 * @param  {number} work_space_id
 * @param  {object} before_video_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    before_video_object: VideoSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからBitmapを復元
    const video = new Video(before_video_object);
    workSpace.libraries.set(video.id, video);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();
    }
};