import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as timelineLayerDeactivatedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerDeactivatedElementService";

/**
 * @description 指定のレイヤーを非アクティブ下
 *              Update specified layers and frames selectively
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip,
    indexes: number[]
): void => {

    for (let idx = 0; idx < indexes.length; ++idx) {

        const layer = movie_clip.getLayer(indexes[idx]);
        if (!layer) {
            return ;
        }

        const externalLayer = new ExternalLayer(work_spcae, movie_clip, layer);
        if (externalLayer.isSelected()) {
            timelineLayerDeactivatedElementService(movie_clip, layer);
        }

        // 内部情報から削除
        movie_clip.deactivatedLayer(layer);
    }
};