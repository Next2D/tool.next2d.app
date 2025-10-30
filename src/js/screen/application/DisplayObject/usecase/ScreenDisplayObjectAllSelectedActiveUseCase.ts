import { execute as screenDisplayObjectActiveElementService } from "../service/ScreenDisplayObjectActiveElementService";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description すべての選択されたDisplayObjectをアクティブ表示にする
 *              Make all selected DisplayObjects active
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const layer = movie_clip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        screenDisplayObjectActiveElementService(layer, depths);
    }
};