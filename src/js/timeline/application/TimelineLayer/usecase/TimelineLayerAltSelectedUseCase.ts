import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerActiveElementService } from "../service/TimelineLayerActiveElementService";
import { execute as timelineLayerInactiveElementService } from "../service/TimelineLayerInactiveElementService";

/**
 * @description レイヤーのAlt選択の実行関数
 *              Execute function for Alt-selection of a layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    layer: Layer
): void => {

    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // 選択中でなければ選択状態に更新
    const index = movie_clip.selectedLayers.indexOf(layer);
    if (index === -1) {
        // 内部情報に追加
        movie_clip.selectedLayers.push(layer);

        // レイヤーElementをアクティブ表示に更新
        timelineLayerActiveElementService(layerElement);
    } else {
        // 内部情報から削除
        movie_clip.selectedLayers.splice(index, 1);

        // レイヤーElementを非アクティブ表示に更新
        timelineLayerInactiveElementService(layerElement);
    }
};