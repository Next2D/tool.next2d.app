import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";

/**
 * @description ライブラリへのインスタンス追加の処理関数
 *              Processing functions for adding instances to the library
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @param  {boolean} [reload=true]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    instance: InstanceImpl<any>,
    reload: boolean = true
): void => {

    // 内部情報を追加
    externalWorkSpaceRegisterInstanceService(work_space, instance);

    // 並び順を更新
    libraryAreaReOrderingService(work_space);

    // 起動中のプロジェクトならライブラリエリアの表示を更新
    if (reload && work_space.active) {
        libraryAreaReloadUseCase();
    }
};