import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import { execute as soundAreaUpdateVolumeHistoryUseCase } from "@/history/application/controller/application/SoundArea/UpdateVolume/usecase/SoundAreaUpdateVolumeHistoryUseCase";

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
    sound_object: SoundObjectImpl,
    frame: number,
    index: number,
    volume: number,
    receiver: boolean = false
): void => {

    const beforeVolume = sound_object.volume;

    // 音量を変更
    sound_object.volume = $clamp(volume, 0 ,100);

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

    if (work_space.active && movie_clip.active
        && movie_clip.currentFrame === frame
    ) {

        const element: HTMLElement | null = document
            .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

        if (!element) {
            return ;
        }

        const node = element.children[index];
        if (!node) {
            return ;
        }

        const volumeElement = node.querySelector(".volume") as HTMLInputElement;
        if (!volumeElement) {
            return ;
        }

        // 音量の表示を変更
        volumeElement.value = `${sound_object.volume}`;
    }
};