import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalSoundUpdateVolumeUseCase } from "@/external/core/application/ExternalSoundObject/usecase/ExternalSoundUpdateVolumeUseCase";

/**
 * @description 個別の音量変更
 *              Individual volume change
 *
 * @param  {IShareReceiveMessage} message
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
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
    await externalSoundUpdateVolumeUseCase(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index,
        message.data[5] as NonNullable<number>,
        true
    );
};