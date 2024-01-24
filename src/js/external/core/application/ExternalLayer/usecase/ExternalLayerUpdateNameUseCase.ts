import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定レイヤーの名前を変更
 *              Rename specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} name
 * @param  {boolean} [element_update = true]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    name: string,
    element_update: boolean = true
): void => {

    // API経由で、表示中ならElementを更新
    if (element_update && work_space.active && movie_clip.active) {
        const layerElement = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            return ;
        }

        const elements = layerElement.getElementsByClassName("view-text");
        if (!elements || !elements.length) {
            return ;
        }

        const element = elements[0] as NonNullable<HTMLElement>;
        element.textContent = name;
    }

    // 内部データを更新
    layer.name = name;
};