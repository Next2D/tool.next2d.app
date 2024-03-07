import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as workSpaceCreateToSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateToSaveDataService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 上書き前の状態のvideoに戻す
 *              Restore the video to its pre-write state
 *
 * @param  {number} work_space_id
 * @param  {object} before_save_object
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    before_save_object: InstanceSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからVideoを復元
    const instance = await workSpaceCreateToSaveDataService(before_save_object);
    workSpace.libraries.set(instance.id, instance);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};