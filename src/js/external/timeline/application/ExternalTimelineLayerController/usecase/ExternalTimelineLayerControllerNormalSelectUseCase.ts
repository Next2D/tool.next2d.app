import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description
 * 
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    frame: number = 0
): void => {

    // 内部情報を更新
    const index = movie_clip.selectedLayers.indexOf(layer);
    if (index === -1) {
        movie_clip.selectedLayers.push(layer);
    }

    if (!frame) {
        frame = movie_clip.currentFrame;
    }

    layer.targetFrame = frame;

    if (!work_spcae.active || !movie_clip.active) {
        return ;
    }

    // TODO
    console.log("koko");
};