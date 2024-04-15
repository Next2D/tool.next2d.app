import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameInsertEmptyFramesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameInsertEmptyFramesUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 空のキーフレームにフレームを追加を実行
 *              Execute to add frames to an empty keyframe
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
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

    // 空のキーフレームにフレームを挿入
    externalTimelineLayerFrameInsertEmptyFramesUseCase(
        workSpace,
        movieClip,
        layer,
        emptyCharacter,
        message.data[4] as NonNullable<number>,
        true
    );

    if (workSpace.active && movieClip.active) {
        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};