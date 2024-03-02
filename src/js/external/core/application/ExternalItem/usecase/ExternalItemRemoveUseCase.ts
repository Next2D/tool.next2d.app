import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";

/**
 * @description
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @param  {boolean} [reload = true]
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    instance: InstanceImpl<any>,
    reload: boolean = true,
    receiver: boolean = false
): Promise<void> => {

    // TODO レイヤーに設置されたDisplayObjectを削除
    // fixed logic

    // TODO 履歴に残す

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(
        work_space, instance
    );

    if (reload && work_space.active) {
        // 選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリエリアを際描画
        libraryAreaReloadUseCase();
    }
};