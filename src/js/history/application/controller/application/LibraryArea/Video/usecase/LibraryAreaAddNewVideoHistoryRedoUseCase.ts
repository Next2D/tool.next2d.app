import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Video } from "@/core/domain/model/Video";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 新規video追加処理のRedo関数
 *              Redo function for new video addition process
 *
 * @param  {number} work_space_id
 * @param  {object} video_save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    video_save_object: VideoSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const video = new Video(video_save_object);
    await video.wait();

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, video);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {

        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリを再描画
        libraryAreaReloadUseCase();
    }
};