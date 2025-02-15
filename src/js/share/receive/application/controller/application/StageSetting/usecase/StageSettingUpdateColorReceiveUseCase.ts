import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalStageUpdateColorUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateColorUseCase";

/**
 * @description ステージの背景色を更新
 *              Update the background color of the stage
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

    // ステージの背景色を更新
    await externalStageUpdateColorUseCase(
        workSpace,
        message.data[3] as NonNullable<string>,
        true
    );
};