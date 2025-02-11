import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Instance } from "@/core/domain/model/Instance";
import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";

/**
 * @description ライブラリへのインスタンス追加の処理関数
 *              Processing functions for adding instances to the library
 *
 * @param  {WorkSpace} work_space
 * @param  {I} instance
 * @param  {boolean} [reload=true]
 * @return {void}
 * @method
 * @public
 */
export const execute = <I extends Instance> (
    work_space: WorkSpace,
    instance: I,
    reload: boolean = true
): void => {

    // 内部情報を追加
    externalWorkSpaceRegisterInstanceService(work_space, instance);

    // 並び順を更新
    libraryAreaReOrderingService(work_space);

    // 起動中のプロジェクトならライブラリエリアの表示を更新
    if (reload && work_space.active) {
        libraryAreaReloadUseCase();

        // サウンドの場合はサウンド選択のSelect Elementを更新
        if (instance.type === $SOUND_TYPE) {
            soundAreaRebuildSelectElementService();
        }
    }
};