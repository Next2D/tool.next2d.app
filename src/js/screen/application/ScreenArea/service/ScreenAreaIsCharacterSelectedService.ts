import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のCharacterが画面上で選択中かどうかを判定する
 *              Determine whether the specified character is selected on the screen.
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    layer: Layer,
    character: Character
): boolean => {

    const frame = movie_clip.currentFrame;
    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const selectedLayer = movie_clip.getLayer(layerIndex);
        if (!selectedLayer || selectedLayer.id !== layer.id) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const depth = depths[idx];
            const activeCharacter = selectedLayer.getCharacter(frame, depth);
            if (!activeCharacter || activeCharacter.id !== character.id) {
                continue;
            }

            return true;
        }
    }
    return false;
};