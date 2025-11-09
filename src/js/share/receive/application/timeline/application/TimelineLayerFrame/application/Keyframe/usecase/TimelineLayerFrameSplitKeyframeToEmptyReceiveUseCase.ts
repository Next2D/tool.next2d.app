import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameSplitKeyframeToEmptyUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameSplitKeyframeToEmptyUseCase";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description キーフレーム分割して空のキーフレームを挿入
 *              Split keyframes and insert empty keyframes
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

    const characterKeyframe = message.data[5] as NonNullable<number>;
    const activeCharacters = layer.getActiveCharacters(characterKeyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // キーフレームを分割して空のキーフレームを追加
    await externalTimelineLayerFrameSplitKeyframeToEmptyUseCase(
        workSpace,
        movieClip,
        layer,
        activeCharacters,
        message.data[4] as NonNullable<number>,
        true
    );

    // Viewの更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip,
        layer
    );
};