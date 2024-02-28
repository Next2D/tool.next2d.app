import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Sound } from "@/core/domain/model/Sound";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 新規sound追加処理のRedo関数
 *              Redo function for new sound addition process
 *
 * @param  {number} work_space_id
 * @param  {object} sound_save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    sound_save_object: VideoSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const sound = new Sound(sound_save_object);
    await sound.wait();

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, sound);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {

        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリを再描画
        libraryAreaReloadUseCase();
    }
};