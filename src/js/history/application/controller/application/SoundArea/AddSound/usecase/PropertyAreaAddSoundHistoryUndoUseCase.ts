import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaSoundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/PropertyAreaSoundAreaRebuildSettingAreaUseCase";

/**
 * @description 追加したサウンドを元に戻す
 *              Undo the added sound
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const sounds = movieClip.getSound(index);
    if (!sounds) {
        return ;
    }

    // 音声一覧から削除
    sounds.splice(index, 1);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active && movieClip.active) {
        // サウンド設定エリアの再構築
        propertyAreaSoundAreaRebuildSettingAreaUseCase();
    }
};