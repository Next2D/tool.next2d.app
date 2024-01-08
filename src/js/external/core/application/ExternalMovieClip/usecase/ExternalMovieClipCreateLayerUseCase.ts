import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";

/**
 * @description 指定のMovieClipにレイヤーを追加
 *              Add a layer to the specified MovieClip
 *
 * @param  {MovieClip} movie_clip
 * @param  {string} [name = ""]
 * @param  {number} [index = 0]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    name: string = "",
    index: number = 0
): Layer => {

    // 新規レイヤーを作成して、指定indexに配置
    const layer = movie_clip.createLayer(name);
    movie_clip.setLayer(layer, index);

    // 作業履歴に登録
    timelineToolLayerAddHistoryUseCase(layer, movie_clip);

    return layer;
};