import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerInactiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerInactiveElementService";
import { execute as timelineLayerFrameAllInactiveElementUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameAllInactiveElementUseCase";

/**
 * @description 全てのレイヤーElementのアクティブ情報をリセット、内部情報はここで初期化はしない。
 *              Elementだけの初期化関数
 *              Reset active information of all layer elements, internal information is not initialized here.
 *              Element-only initialization functions
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];

        const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            continue ;
        }

        // レイヤーのアクティブ表示を初期化
        timelineLayerInactiveElementService(layerElement);

        // フレームが未選択の場合は終了
        if (!movie_clip.selectedStartFrame) {
            continue ;
        }

        // フレーム側のElementを更新
        timelineLayerFrameAllInactiveElementUseCase(
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            movie_clip
        );
    }
};