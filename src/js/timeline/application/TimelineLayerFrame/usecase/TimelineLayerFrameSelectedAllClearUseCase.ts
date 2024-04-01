import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameAllInactiveElementUseCase } from "./TimelineLayerFrameAllInactiveElementUseCase";

/**
 * @description 指定の MovieClip の選択中のフレームを全てクリアする
 *              Clear all selected frames of the specified MovieClip
 *
 * @param {MovieClip} movie_clip
 * @returns {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // 選択中のフレームの表示を初期化
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const selectedLayer = movie_clip.selectedLayers[idx];
        const layerElement = timelineLayer.elements[selectedLayer.getDisplayIndex()];
        if (!layerElement) {
            continue;
        }

        timelineLayerFrameAllInactiveElementUseCase(
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            movie_clip
        );
    }

    // フレーム選択を初期化
    movie_clip.clearSelectedFrame();
};