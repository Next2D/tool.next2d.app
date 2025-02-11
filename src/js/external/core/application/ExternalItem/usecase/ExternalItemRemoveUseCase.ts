import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Instance } from "@/core/domain/model/Instance";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaRemoveInstanceHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Instance/usecase/LibraryAreaRemoveInstanceHistoryUseCase";

/**
 * @description 指定のアイテムを削除
 *              Delete the specified item
 *
 * @param  {WorkSpace} work_space
 * @param  {I} instance
 * @param  {boolean} [reload = true]
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = async <I extends Instance> (
    work_space: WorkSpace,
    instance: I,
    reload: boolean = true,
    receiver: boolean = false
): Promise<void> => {

    // TODO レイヤーに設置されたDisplayObjectを削除
    // fixed logic

    // 履歴に残す
    libraryAreaRemoveInstanceHistoryUseCase(
        work_space,
        work_space.scene,
        instance,
        receiver
    );

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(
        work_space, instance
    );

    if (reload && work_space.active) {
        // 選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリエリアを再描画
        libraryAreaReloadUseCase();
    }
};