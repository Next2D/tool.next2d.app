import type { Video } from "@/core/domain/model/Video";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 新規video追加処理のUndo関数
 *              Undo function for new video addition process
 *
 * @param  {number} work_space_id
 * @param  {object} video_save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    video_save_object: VideoSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const video: InstanceImpl<Video> | null = workSpace.getLibrary(video_save_object.id);
    if (!video) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, video);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {

        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリを再描画
        libraryAreaReloadUseCase();
    }
};