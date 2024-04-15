import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 空のキーフレーム追加を実行
 *              Perform empty keyframe addition
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

    const index = message.data[2] as NonNullable<number>;
    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 空のキーフレームを追加
    externalTimelineLayerFrameCreateEmptyKeyframeUseCase(
        workSpace,
        movieClip,
        layer,
        message.data[3] as NonNullable<number>, // startFrame
        message.data[4] as NonNullable<number>, // endFrame
        true
    );

    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // スクリーンエリアを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};