import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerFrameUpdateKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateKeyframe/usecase/TimelineLayerFrameUpdateKeyframeHistoryUseCase";

/**
 * @description キーフレーム更新を実行
 *              Perform keyframe update
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
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
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        return ;
    }

    // 終了フレームを更新
    const afterEndFrame = message.data[5] as NonNullable<number>;
    for (let idx = 0; idx < activeCharacters.length; idx++) {
        const character = activeCharacters[idx];
        character.endFrame = afterEndFrame;
    }

    // 履歴に登録
    timelineLayerFrameUpdateKeyframeHistoryUseCase(
        workSpace,
        movieClip,
        layer,
        keyframe,
        message.data[4] as NonNullable<number>,
        afterEndFrame,
        true
    );

    if (workSpace.active && movieClip.active) {
        const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
        if (!layerElement) {
            return ;
        }

        // フレームのstyleを更新
        timelineLayerFrameUpdateStyleService(
            workSpace, movieClip,
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            $getLeftFrame()
        );

        // xスクロールの幅を更新
        timelineScrollUpdateWidthService();
    }
};