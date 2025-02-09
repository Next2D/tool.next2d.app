import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { ISoundObject } from "@/interface/ISoundObject";
import { execute as soundAreaUpdateVolumeHistoryUseCase } from "@/history/application/controller/application/SoundArea/UpdateVolume/usecase/SoundAreaUpdateVolumeHistoryUseCase";
import { execute as soundAreaUpdateVolumeElementService } from "@/controller/application/SoundArea/service/SoundAreaUpdateVolumeElementService";

/**
 * @description 個別の音声設定の音量変更
 *              Volume change of individual sound settings
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {object} sound_object
 * @param  {number} frame
 * @param  {number} index
 * @param  {number} volume
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    sound_object: ISoundObject,
    frame: number,
    index: number,
    volume: number,
    receiver: boolean = false
): void => {

    volume = $clamp(volume, 0, 100);

    // 変更がなければ終了
    if (sound_object.volume === volume) {
        return ;
    }
    const beforeVolume = sound_object.volume;

    // 音量を変更
    sound_object.volume = volume;

    // 履歴を登録
    soundAreaUpdateVolumeHistoryUseCase(
        work_space,
        movie_clip,
        sound_object,
        frame,
        index,
        beforeVolume,
        receiver
    );

    // 音量の表示を更新
    if (work_space.active && movie_clip.active
        && movie_clip.currentFrame === frame
    ) {
        soundAreaUpdateVolumeElementService(sound_object, index);
    }
};