import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameDeleteEmptyKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameDeleteEmptyKeyframeUseCase";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description 空のキーフレームの削除を実行
 *              Perform the deletion of empty keyframes
 *
 * @param  {object} message
 * @return {Promise}
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

    const layerIndex = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerIndex);
    if (!layer) {
        return ;
    }

    const keyframe = message.data[3] as NonNullable<number>;
    const emptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (!emptyCharacter) {
        return ;
    }

    // 空のキーフレームを削除
    await externalTimelineLayerFrameDeleteEmptyKeyframeUseCase(
        workSpace,
        movieClip,
        layer,
        emptyCharacter,
        true
    );

    // Viewの更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};