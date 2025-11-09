import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameRemoveKeyFramesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameRemoveKeyFramesUseCase";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description キーフレームのフレーム削除を実行
 *              Perform keyframe frame deletion
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
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // キーフレームのフレームを削除
    const beforeEndFrame = message.data[4] as NonNullable<number>;
    const afterEndFrame  = message.data[5] as NonNullable<number>;
    await externalTimelineLayerFrameRemoveKeyFramesUseCase(
        workSpace,
        movieClip,
        layer,
        activeCharacters,
        beforeEndFrame - afterEndFrame,
        true
    );

    // Viewの更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};