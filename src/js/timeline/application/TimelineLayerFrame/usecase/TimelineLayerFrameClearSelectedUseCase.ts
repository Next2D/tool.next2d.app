import { execute as timelineLayerDeactivatedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerDeactivatedElementService";
import { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description タイムラインのマウスダウンで選択した最初のフレームとレイヤーをセット
 *              Set first frame and layer selected with mouse down on timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];

        // フレームの表示を初期化
        timelineLayerDeactivatedElementService(movie_clip, layer);

    }
};