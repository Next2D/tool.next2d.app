import { MovieClip } from "@/core/domain/model/MovieClip";
import { IBounds } from "@/interface/IBounds";
import { $calcBoundingBox } from "../../CoreUtil";

/**
 * @description 指定のMovieClipの、指定フレームのbounding boxを計算
 *              Calculate the bounding box of the specified MovieClip at the specified frame
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, frame: number = 1): IBounds | null =>
{
    const boundingBoxs = [];
    for (let idx = 0; idx < movie_clip.layers.length; idx++) {
        const layer = movie_clip.layers[idx];
        if (!layer) {
            continue ;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        for (let idx = 0; idx < activeCharacters.length; idx++) {
            const character = activeCharacters[idx];
            if (!character) {
                continue ;
            }

            const bounds = character.getBounds(frame);
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