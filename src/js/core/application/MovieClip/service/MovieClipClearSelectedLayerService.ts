import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のMovieClipで選択中のLayerを全て解放
 *              Release all currently selected Layers in the specified MovieClip
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // 選択中のLayerを初期化
    const selectedLayers = movie_clip.selectedLayers;
    for (let idx = 0; idx < selectedLayers.length; ++idx) {
        const layer = selectedLayers[idx];
        layer.clear();
    }

    // 選択中のLayerを初期化
    selectedLayers.length = 0;
};