import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のMovieClipのレイヤーを選択状態に更新
 *              Update the layer of the specified MovieClip to selected state
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, layer: Layer, frame: number): void =>
{
    // 内部情報を更新
    movie_clip.selectedLayer(layer);

    // レイヤーを初期化して、選択状態をセット
    layer.targetFrame = frame;
    layer.selectedFrame.start = frame;
    layer.selectedFrame.end   = frame;
};