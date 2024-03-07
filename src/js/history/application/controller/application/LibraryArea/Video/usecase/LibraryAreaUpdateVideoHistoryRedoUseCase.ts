import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Video } from "@/core/domain/model/Video";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 上書き後の状態のvideoに戻す
 *              Restore the video to its post-overwrite state
 *
 * @param  {number} work_space_id
 * @param  {object} after_video_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_video_object: VideoSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからBitmapを復元
    const video = new Video(after_video_object);
    workSpace.libraries.set(video.id, video);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};