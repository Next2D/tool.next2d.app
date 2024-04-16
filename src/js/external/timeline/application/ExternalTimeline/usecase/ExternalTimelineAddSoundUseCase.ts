import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalSound } from "@/external/core/domain/model/ExternalSound";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { ExternalItemImpl } from "@/interface/ExternalItemImpl";
import { execute as propertyAreaAddSoundHistoryUseCase } from "@/history/application/controller/application/PropertyArea/application/SoundArea/AddSound/usecase/PropertyAreaAddSoundHistoryUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { execute as propertyAreaSoundAreaAddSettingAreaService } from "@/controller/application/PropertyArea/application/SoundArea/service/PropertyAreaSoundAreaAddSettingAreaService";

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
    path: string,
    receiver: boolean = false
): void => {

    const externalLibrary = new ExternalLibrary(work_space);
    const externalSound: ExternalItemImpl<ExternalSound> | null = externalLibrary.getItem(path);
    if (!externalSound || externalSound.type !== $SOUND_TYPE) {
        return ;
    }

    // 新規サウンドオブジェクトを作成
    const sound: SoundObjectImpl = {
        "libraryId": externalSound.id,
        "volume": 100,
        "autoPlay": false,
        "loopCount": 0
    };

    const currentFrame = movie_clip.currentFrame;

    // MovieClipにサウンドオブジェクトを登録
    movie_clip.setSound(currentFrame, sound);

    // 履歴に登録
    // fixed logic
    propertyAreaAddSoundHistoryUseCase(
        work_space,
        movie_clip,
        sound,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        const index = currentFrame - $getLeftFrame();
        const element: HTMLElement | undefined = timelineHeader.elements[index] as HTMLElement;
        if (!element) {
            return ;
        }

        // サウンドElementを更新
        timelineHeaderUpdateSoundElementService(element, currentFrame);

        const sounds = movie_clip.getSound(currentFrame);
        if (!sounds) {
            return ;
        }
        // サウンドエリアに設定エリアを追加
        propertyAreaSoundAreaAddSettingAreaService(
            sounds.indexOf(sound),
            externalSound.name,
            sound
        );
    }
};