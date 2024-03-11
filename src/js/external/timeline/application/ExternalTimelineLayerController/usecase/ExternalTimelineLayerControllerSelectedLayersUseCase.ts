import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerSelectedUseCase";

/**
 * @description 指定Indexのレイヤーを選択状態に更新
 *              Update the layer of the specified Index to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {array} indexes
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    indexes: number[]
): void => {

    for (let idx: number = 0; idx < indexes.length; ++idx) {

        const index = indexes[idx];

        const layer: Layer | undefined = movie_clip.layers[index];
        if (!layer) {
            continue;
        }

        // 内部情報を更新
        if (movie_clip.selectedLayers.indexOf(layer) === -1) {
            movie_clip.selectedLayers.push(layer);
        }

        // アクティブなら表示を更新
        if (work_space.active && movie_clip.active) {
            timelineLayerSelectedUseCase(layer);
        }

    }
};