import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description レイヤーのAlt選択の実行関数
 *              Execute function for Alt-selection of a layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer
): Promise<void> => {

    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // 選択中でなければ選択状態に更新
    const cloneSelectedLayers = movie_clip.selectedLayers.slice();
    const index = cloneSelectedLayers.indexOf(layer);
    if (index === -1) {
        // 内部情報に追加
        cloneSelectedLayers.push(layer);
    } else {
        // 内部情報から削除
        cloneSelectedLayers.splice(index, 1);
    }

    const indexes = [];
    for (let idx = 0; idx < cloneSelectedLayers.length; ++idx) {

        const selectedLayer = cloneSelectedLayers[idx];
        if (!selectedLayer) {
            continue ;
        }

        // 選択したレイヤーのindexを格納
        const externalLayer = new ExternalLayer(
            work_space, movie_clip, selectedLayer
        );
        indexes.push(externalLayer.index);
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(work_space, movie_clip);

    // 単体選択の外部APIを実行
    await externalTimeline
        .selectedLayers(indexes);
};