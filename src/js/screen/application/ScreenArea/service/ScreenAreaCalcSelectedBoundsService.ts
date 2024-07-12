import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $calcBoundingBox } from "@/core/application/CoreUtil";
import { BoundsImpl } from "@/interface/BoundsImpl";

/**
 * @description 選択中のbounding boxを計算
 *              Calculate the selected bounding box
 *
 * @param  {MovieClip} movie_clip
 * @return {object}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): BoundsImpl | null =>
{
    if (!movie_clip.selectedDepths.size) {
        return null;
    }

    // 選択範囲のElementを表示
    const frame = movie_clip.currentFrame;

    // 選択範囲のbounding boxを取得
    const boundingBoxs = [];
    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const layer = movie_clip.getLayer(layerIndex);
        if (!layer || layer.lock) {
            continue ;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            const bounds = character.getBounds();
            if (!bounds) {
                continue ;
            }

            boundingBoxs.push(bounds);
        }
    }

    return boundingBoxs.length
        ? $calcBoundingBox(boundingBoxs)
        : null;
};