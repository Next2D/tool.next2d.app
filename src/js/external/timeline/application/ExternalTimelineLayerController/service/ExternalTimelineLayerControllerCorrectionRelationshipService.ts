import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定の親レイヤーの子レイヤーを移動
 *              Move the child layer of the specified parent layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} parent_layer
 * @param  {number} before_index
 * @return {number}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    parent_layer: Layer,
    before_index: number
): number => {

    const childLayers = [];

    const layers = movie_clip.layers;
    for (let idx = before_index; idx < layers.length; ++idx) {

        const childLayer = layers[idx];
        if (childLayers.indexOf(childLayer) > -1) {
            continue;
        }

        if (before_index !== childLayer.parentIndex) {
            if (idx > before_index + 1) {
                break;
            }
            continue;
        }

        // 子のレイヤーを配列から削除
        layers.splice(idx, 1);

        // 親レイヤーの配下に移動
        const parentIndex = layers.indexOf(parent_layer);
        layers.splice(parentIndex + childLayers.length + 1, 0, childLayer);

        childLayers.push(childLayer);

        --idx;
    }

    // 子のレイヤーに親のindexを設定
    const parentIndex = layers.indexOf(parent_layer);
    for (let idx = 0; idx < childLayers.length; ++idx) {
        const childLayer = childLayers[idx];
        childLayer.parentIndex = parentIndex;
    }

    return childLayers.length;
};