import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IInstance } from "@/interface/IInstance";
import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipUpdateScriptUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateScriptUseCase";

/**
  * @description スクリプトを更新
 *               Update Script
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

    externalMovieClipUpdateScriptUseCase(
        workSpace,
        movieClip,
        message.data[2] as NonNullable<number>, // frame
        message.data[4] as NonNullable<string>, // after script
        true
    );
};