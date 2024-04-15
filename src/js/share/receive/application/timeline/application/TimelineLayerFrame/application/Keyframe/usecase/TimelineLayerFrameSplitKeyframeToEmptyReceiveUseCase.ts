import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalTimelineLayerFrameSplitKeyframeToEmptyUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameSplitKeyframeToEmptyUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description キーフレーム分割して空のキーフレームを挿入
 *              Split keyframes and insert empty keyframes
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

    const characterKeyframe = message.data[5] as NonNullable<number>;
    const activeCharacters = layer.getActiveCharacters(characterKeyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // キーフレームを分割して空のキーフレームを追加
    externalTimelineLayerFrameSplitKeyframeToEmptyUseCase(
        workSpace,
        movieClip,
        layer,
        activeCharacters,
        message.data[4] as NonNullable<number>,
        true
    );

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // スクリーンエリアの再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};