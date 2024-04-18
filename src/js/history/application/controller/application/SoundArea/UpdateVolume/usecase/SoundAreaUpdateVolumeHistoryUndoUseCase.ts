import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaUpdateVolumeElementService } from "@/controller/application/SoundArea/service/SoundAreaUpdateVolumeElementService";

/**
 * @description 個別の音声データの音量更新の履歴を登録を元に戻す
 *              Undo the history of updating the volume of individual sound data
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {object} sound_object
 * @param  {number} frame
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number,
    index: number,
    before_volume: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // 音声一覧に戻す
    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    // 音量を変更前の状態に戻す
    const soundObject = sounds[index];
    soundObject.volume = before_volume;

    // 音量の表示を更新
    if (workSpace.active && movieClip.active
        && movieClip.currentFrame === frame
    ) {
        soundAreaUpdateVolumeElementService(soundObject, index);
    }
};