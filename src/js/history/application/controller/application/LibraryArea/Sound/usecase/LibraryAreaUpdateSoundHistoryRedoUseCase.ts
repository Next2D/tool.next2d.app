import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { Sound } from "@/core/domain/model/Sound";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 上書き後の状態のsoundに戻す
 *              Restore the sound to its post-overwrite state
 *
 * @param  {number} work_space_id
 * @param  {object} after_sound_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_sound_object: SoundSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからBitmapを復元
    const sound = new Sound(after_sound_object);
    workSpace.libraries.set(sound.id, sound);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};