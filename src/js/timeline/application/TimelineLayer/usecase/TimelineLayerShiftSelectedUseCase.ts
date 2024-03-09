import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";

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
    console.log(movie_clip, layer);
};