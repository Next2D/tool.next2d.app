import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 上書き後の状態のbitmapに戻す
 *              Restore the bitmap to its post-overwrite state
 *
 * @param  {number} work_space_id
 * @param  {object} after_bitmap_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    instance_object: InstanceSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからBitmapを復元
    const instance = workSpace.getLibrary(instance_object.id);

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(
        workSpace, instance
    );

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリエリアを際描画
        libraryAreaReloadUseCase();
    }
};