import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as workSpaceCreateToSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateToSaveDataService";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external//core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 削除したアイテムを復元
 *              Restore deleted items
 *
 * @param  {number} work_space_id
 * @param  {object} instance_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    instance_object: InstanceSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからオブジェクトを復元
    const instance = await workSpaceCreateToSaveDataService(instance_object);

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, instance);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリエリアを際描画
        libraryAreaReloadUseCase();
    }
};