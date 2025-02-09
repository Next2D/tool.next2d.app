import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalSoundAreaRemoveSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaRemoveSoundUseCase";

/**
 * @description MovieClipへのサウンドを削除
 *              Remove sound from MovieClip
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
    const movieClip: IInstance<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const frame = message.data[3] as NonNullable<number>;
    const index = message.data[4] as NonNullable<number>;

    // サウンドを削除
    externalSoundAreaRemoveSoundUseCase(
        workSpace,
        movieClip,
        frame,
        index,
        true
    );
};