import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalTimelineLayerControllerBehindRelationUseCase } from "./ExternalTimelineLayerControllerBehindRelationUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description レイヤーの親子関係性をチェックする
 *              Check the parent-child relationship of the layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): void => {

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    // 移動先のレイヤーを取得
    const distLayer = layers[index];

    let changeLayerType = false;
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];
        if (layer.parentId !== distLayer.parentId) {
            continue;
        }

        const externalLayer = new ExternalLayer(work_space, movie_clip, layer);
        externalLayer.layerType = "normal";

        changeLayerType = true;
    }

    // 親子関係の解除がなければ通常の移動処理を行う
    if (!changeLayerType) {
        externalTimelineLayerControllerBehindRelationUseCase(
            work_space,
            movie_clip,
            index
        );
    }
};