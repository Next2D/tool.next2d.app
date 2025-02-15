import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipUpdateLabelUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateLabelUseCase";

/**
  * @description 新規ラベルを追加
 *               Add a new label
 *
 * @param  {object} message
 * @return {void}
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

    await externalMovieClipUpdateLabelUseCase(
        workSpace,
        movieClip,
        message.data[2] as NonNullable<number>, // frame
        message.data[3] as NonNullable<string>, // new label text
        true
    );
};