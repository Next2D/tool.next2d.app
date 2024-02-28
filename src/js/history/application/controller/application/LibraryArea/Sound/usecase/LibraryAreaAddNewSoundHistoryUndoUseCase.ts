import type { Sound } from "@/core/domain/model/Sound";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 新規sound追加処理のUndo関数
 *              Undo function for new sound addition process
 *
 * @param  {number} work_space_id
 * @param  {object} sound_save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    sound_save_object: SoundSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const sound: InstanceImpl<Sound> | null = workSpace.getLibrary(sound_save_object.id);
    if (!sound) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, sound);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {

        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリを再描画
        libraryAreaReloadUseCase();
    }
};