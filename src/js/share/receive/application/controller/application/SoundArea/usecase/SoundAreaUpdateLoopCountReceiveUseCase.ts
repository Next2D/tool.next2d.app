import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalSoundUpdateLoopCountUseCase } from "@/external/core/application/ExternalSoundObject/usecase/ExternalSoundUpdateLoopCountUseCase";

/**
 * @description 個別のループ回数変更
 *              Individual loop count change
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

    // ループ回数を更新
    externalSoundUpdateLoopCountUseCase(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index,
        message.data[5] as NonNullable<number>,
        true
    );
};