import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { ISoundObject } from "@/interface/ISoundObject";
import { execute as soundAreaUpdateLoopCountHistoryUseCase } from "@/history/application/controller/application/SoundArea/UpdateLoopCount/usecase/SoundAreaUpdateLoopCountHistoryUseCase";
import { execute as soundAreaUpdateLoopCountElementService } from "@/controller/application/SoundArea/service/SoundAreaUpdateLoopCountElementService";

/**
 * @description 個別のループ回数設定
 *              Individual loop count setting
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {object} sound_object
 * @param  {number} frame
 * @param  {number} index
 * @param  {number} loop_count
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
    loop_count: number,
    receiver: boolean = false
): void => {

    // 変更がなければ終了
    const loopCount = $clamp(loop_count, 0, 65535);
    if (sound_object.loopCount === loopCount) {
        return ;
    }

    const beforeLoopCount = sound_object.loopCount;

    // 音量を変更
    sound_object.loopCount = loopCount;

    // 履歴を登録
    soundAreaUpdateLoopCountHistoryUseCase(
        work_space,
        movie_clip,
        sound_object,
        frame,
        index,
        beforeLoopCount,
        receiver
    );

    // 音量の表示を更新
    if (work_space.active && movie_clip.active
        && movie_clip.currentFrame === frame
    ) {
        soundAreaUpdateLoopCountElementService(sound_object, index);
    }
};