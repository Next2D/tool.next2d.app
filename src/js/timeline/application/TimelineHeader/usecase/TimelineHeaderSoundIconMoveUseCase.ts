import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Sound } from "@/core/domain/model/Sound";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase";
import { execute as externalSoundAreaRemoveSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaRemoveSoundUseCase";
import { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description タイムラインヘッダーサウンドアイコンの移動の実行関数
 *              Execution function of the timeline header sound icon move
 *
 * @param  {number} source_frame
 * @param  {number} dest_frame
 * @param  {boolean} use_alt_key
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    source_frame: number,
    dest_frame: number,
    use_alt_key: boolean
): void => {

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const soundObjects = movieClip.getSound(source_frame);
    if (!soundObjects) {
        return ;
    }

    // 削除されるので複製を生成
    const cloneSoundObjects = soundObjects.slice();

    // 移動先のフレームが存在しない場合はアイコンを削除して終了
    if (!dest_frame) {
        for (let idx = 0; cloneSoundObjects.length > idx; ++idx) {
            externalSoundAreaRemoveSoundUseCase(
                workSpace,
                movieClip,
                source_frame,
                0
            );
        }
        return ;
    }

    // Altを押下してない時は移動元のサウンドを削除
    if (!use_alt_key) {
        for (let idx = 0; cloneSoundObjects.length > idx; ++idx) {
            externalSoundAreaRemoveSoundUseCase(
                workSpace,
                movieClip,
                source_frame,
                0
            );
        }
    }

    // 移動先のサウンドがあれば削除
    if (movieClip.hasSound(dest_frame)) {
        externalSoundAreaRemoveSoundUseCase(
            workSpace,
            movieClip,
            dest_frame,
            0
        );
    }

    // 移動元のサウンドを挿入
    for (let idx = 0; cloneSoundObjects.length > idx; ++idx) {

        const soundObject = cloneSoundObjects[idx];

        const sound: InstanceImpl<Sound> = workSpace.getLibrary(soundObject.libraryId);
        if (!sound) {
            continue;
        }

        // サウンドエリアにサウンドを追加
        externalSoundAreaAddSoundUseCase(
            workSpace,
            movieClip,
            dest_frame,
            sound.getPath(workSpace),
            soundObject.volume,
            soundObject.autoPlay,
            soundObject.loopCount
        );
    }
};