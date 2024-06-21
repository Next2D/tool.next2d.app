import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalSound } from "@/external/core/domain/model/ExternalSound";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { ExternalItemImpl } from "@/interface/ExternalItemImpl";
import { execute as soundAreaAddSoundHistoryUseCase } from "@/history/application/controller/application/SoundArea/AddSound/usecase/SoundAreaAddSoundHistoryUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { execute as soundAreaAddSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaAddSettingAreaUseCase";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";

/**
 * @description タイムラインにサウンドを追加
 *              Add sound to the timeline
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} path
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    path: string,
    volume: number = 100,
    auto_play: boolean = false,
    loop_count: number = 0,
    receiver: boolean = false
): void => {

    const externalLibrary = new ExternalLibrary(work_space);
    const externalSound: ExternalItemImpl<ExternalSound> | null = externalLibrary.getItem(path);
    if (!externalSound || externalSound.type !== $SOUND_TYPE) {
        return ;
    }

    // 新規サウンドオブジェクトを作成
    const soundObject: SoundObjectImpl = {
        "libraryId": externalSound.id,
        "volume": volume,
        "autoPlay": auto_play,
        "loopCount": loop_count
    };

    // MovieClipにサウンドオブジェクトを登録
    movie_clip.setSound(frame, soundObject);

    // 履歴に登録
    // fixed logic
    soundAreaAddSoundHistoryUseCase(
        work_space,
        movie_clip,
        soundObject,
        frame,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        const index = frame - $getLeftFrame();
        const element: HTMLElement | undefined = timelineHeader.elements[index] as HTMLElement;
        if (!element) {
            return ;
        }

        // サウンドElementを更新
        timelineHeaderUpdateSoundElementService(element, frame);

        // フレームが一致する場合は設定エリアに追加
        if (movie_clip.currentFrame === frame) {
            const sounds = movie_clip.getSound(frame);
            if (!sounds) {
                return ;
            }

            // サウンドエリアに設定エリアを追加
            soundAreaAddSettingAreaUseCase(
                sounds.indexOf(soundObject),
                externalSound.name,
                soundObject
            );

            // プロパティエリアの高さを更新
            propertyAreaScrollUpdateHeightService();
        }
    }
};