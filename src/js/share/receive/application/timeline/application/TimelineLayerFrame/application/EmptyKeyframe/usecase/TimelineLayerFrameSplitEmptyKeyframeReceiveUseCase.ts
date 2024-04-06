import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as externalTimelineLayerFrameSplitEmptyKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameSplitEmptyKeyframeUseCase";

/**
 * @description 空のキーフレーム追加を実行
 *              Perform empty keyframe addition
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

    const emptyCharacterIndex = message.data[3] as NonNullable<number>;
    const emptyCharacter = layer.emptyCharacters[emptyCharacterIndex];
    if (!emptyCharacter) {
        return ;
    }

    // 空のキーフレームを分割
    externalTimelineLayerFrameSplitEmptyKeyframeUseCase(
        workSpace,
        movieClip,
        layer,
        emptyCharacter,
        message.data[5] as NonNullable<number>,
        true
    );

    // アクティブなら表示を更新
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