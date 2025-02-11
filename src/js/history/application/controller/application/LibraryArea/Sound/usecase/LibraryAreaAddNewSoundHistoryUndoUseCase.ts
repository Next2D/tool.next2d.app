import type { Sound } from "@/core/domain/model/Sound";
import type { ISoundSaveObject } from "@/interface/ISoundSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";

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
    sound_save_object: ISoundSaveObject
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const sound = workSpace.getLibrary(sound_save_object.id) as Sound;
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

        // サウンド選択のSelectElementを再構築
        soundAreaRebuildSelectElementService();
    }
};