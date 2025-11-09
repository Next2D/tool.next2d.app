import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameInsertKeyFramesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameInsertKeyFramesUseCase";
import { execute as viewTimelineLayerFrameUpdateFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameUpdateFrameUseCase";

/**
 * @description キーフレームにフレームを追加を実行
 *              Execute to add frames to a keyframe
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

    const layerIndex = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(layerIndex);
    if (!layer) {
        return ;
    }

    const characters = layer.getActiveCharacters(
        message.data[3] as NonNullable<number>
    );
    if (!characters.length) {
        return ;
    }

    // キーフレームにフレームを挿入
    await externalTimelineLayerFrameInsertKeyFramesUseCase(
        workSpace,
        movieClip,
        layer,
        characters,
        message.data[4] as NonNullable<number>,
        true
    );

    // Viewの更新
    await viewTimelineLayerFrameUpdateFrameUseCase(
        workSpace,
        movieClip
    );
};