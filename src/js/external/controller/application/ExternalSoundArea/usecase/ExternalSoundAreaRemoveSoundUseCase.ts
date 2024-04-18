import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as soundAreaRemoveSoundHistoryUseCase } from "@/history/application/controller/application/SoundArea/RemoveSound/usecase/SoundAreaRemoveSoundHistoryUseCase";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";

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

    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    // 履歴を登録
    // fixed logic
    soundAreaRemoveSoundHistoryUseCase(
        work_space,
        movie_clip,
        soundObject,
        frame,
        index,
        receiver
    );

    // サウンドを配列から削除
    sounds.splice(index, 1);

    // サウンドの配列が空になったらマップからも削除
    if (!sounds.length) {
        movie_clip.deleteSound(frame);
    }

    // サウンド設定エリアを再構築
    if (work_space.active && movie_clip.active) {

        // サウンド設定エリアの再構築
        if (movie_clip.currentFrame === frame) {
            soundAreaRebuildSettingAreaUseCase();
        }

        if (!sounds.length) {
            const layerIndex = frame - $getLeftFrame();
            const element: HTMLElement | undefined = timelineHeader.elements[layerIndex] as HTMLElement;
            if (!element) {
                return ;
            }

            // タイムラインヘッダーのサウンドElementを更新
            timelineHeaderUpdateSoundElementService(element, frame);
        }
    }
};