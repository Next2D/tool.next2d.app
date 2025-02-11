import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaAddSoundHistoryUseCase } from "@/history/application/controller/application/SoundArea/AddSound/usecase/SoundAreaAddSoundHistoryUseCase";
import { ISoundObject } from "@/interface/ISoundObject";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";

/**
 * @description MovieClipへのサウンドを追加
 *              Add sound to MovieClip
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: IShareReceiveMessage): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const soundObject = message.data[2] as NonNullable<ISoundObject>;
    const frame = message.data[3] as NonNullable<number>;

    // サウンドを追加
    movieClip.setSound(frame, soundObject);

    // 履歴に登録
    soundAreaAddSoundHistoryUseCase(
        workSpace,
        movieClip,
        soundObject,
        frame,
        true
    );

    // サウンド設定エリアの再構築
    if (workSpace.active && movieClip.active) {

        // サウンド設定の再構成
        soundAreaRebuildSettingAreaUseCase();

        const index = message.data[4] as NonNullable<number>;
        if (!index) {
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