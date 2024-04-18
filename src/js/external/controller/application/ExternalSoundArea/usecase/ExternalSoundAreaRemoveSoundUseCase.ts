import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as propertyAreaSoundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/PropertyAreaSoundAreaRebuildSettingAreaUseCase";

/**
 * @description 指定フレームのサウンドを削除
 *              Remove sound from the specified frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {number} index
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    index: number,
    receiver: boolean = false
): void => {

    const sounds = movie_clip.getSound(frame);
    if (!sounds) {
        return ;
    }

    sounds.splice(index, 1);

    // サウンドの配列が空になったらマップからも削除
    if (!sounds.length) {
        movie_clip.deleteSound(frame);
    }

    // TODO 履歴を登録

    // サウンド設定エリアを再構築
    if (work_space.active && movie_clip.active
        && movie_clip.currentFrame === frame
    ) {
        propertyAreaSoundAreaRebuildSettingAreaUseCase();
    }
};