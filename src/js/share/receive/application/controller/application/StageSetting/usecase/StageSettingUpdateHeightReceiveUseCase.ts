import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalStageUpdateHeightUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateHeightUseCase";

/**
 * @description ステージの高さを更新
 *              Update the height of the stage
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

    // ステージの高さを更新
    externalStageUpdateHeightUseCase(
        workSpace,
        message.data[3] as NonNullable<number>,
        true
    );
};