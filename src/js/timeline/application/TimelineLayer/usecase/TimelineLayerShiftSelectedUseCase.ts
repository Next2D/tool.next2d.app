import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description レイヤーのShift選択の実行関数
 *              Execute function for Shift-selection of a layer
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

    // 選択したレイヤーがなければ今回選択したレイヤーを最初に選択したレイヤーに設定
    const firstSelectedLayer: Layer = movie_clip.selectedLayers.length
        ? movie_clip.selectedLayers[0]
        : layer;

    const selectedIndex: number      = movie_clip.layers.indexOf(layer);
    const firstSelectedIndex: number = movie_clip.layers.indexOf(firstSelectedLayer);

    const minIndex: number = Math.min(selectedIndex, firstSelectedIndex);
    const maxIndex: number = Math.max(selectedIndex, firstSelectedIndex);

    // 最初に選んだindexをセットして選択範囲のindexを配列に格納
    const indexes: number[] = [firstSelectedIndex];
    for (let index: number = minIndex; index <= maxIndex; ++index) {
        if (index === firstSelectedIndex) {
            continue;
        }
        indexes.push(index);
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline($getCurrentWorkSpace(), movie_clip);
    externalTimeline.selectedLayers(...indexes);
};