import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerFrameSplitEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitEmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeHistoryUseCase";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

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

    // 追加するキーフレーム
    const keyframe = message.data[5] as NonNullable<number>;

    // 追加の空のキーフレームを生成
    const newEmptyCharacter = new EmptyCharacter();
    newEmptyCharacter.startFrame = keyframe;
    newEmptyCharacter.endFrame   = emptyCharacter.endFrame;

    // 指定のindexに登録
    const newEmptyCharacterIndex = message.data[4] as NonNullable<number>;
    layer.emptyCharacters.splice(newEmptyCharacterIndex, 0, newEmptyCharacter);

    // 終了フレームを更新
    emptyCharacter.endFrame = keyframe;

    // 履歴に登録
    timelineLayerFrameSplitEmptyKeyframeHistoryUseCase(
        workSpace,
        movieClip,
        layer,
        emptyCharacter,
        newEmptyCharacter,
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