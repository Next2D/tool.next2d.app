import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalSoundUpdateVolumeUseCase } from "@/external/core/application/ExternalSoundObject/usecase/ExternalSoundUpdateVolumeUseCase";

/**
 * @description MovieClipへのサウンドを追加
 *              Add sound to MovieClip
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    // サウンドを追加
    const frame = message.data[2] as NonNullable<number>;
    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    const index = message.data[3] as NonNullable<number>;
    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    // 音声を更新
    externalSoundUpdateVolumeUseCase(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index,
        message.data[5] as NonNullable<number>,
        true
    );
};