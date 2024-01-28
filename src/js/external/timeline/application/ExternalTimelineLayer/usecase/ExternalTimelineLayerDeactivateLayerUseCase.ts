import type { Layer } from "@/core/domain/model/Layer";
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
    layer: Layer
): void => {

    // 表示されているプロジェクトであれば表示を更新
    if (work_spcae.active && movie_clip.active) {

        const externalLayer = new ExternalLayer(work_spcae, movie_clip, layer);

        // 選択中なら、対象のElementを非アクティブに更新
        if (externalLayer.isSelected()) {
            timelineLayerDeactivatedElementService(layer);
        }
    }

    // 内部情報から削除
    movie_clip.deactivatedLayer(layer);
};