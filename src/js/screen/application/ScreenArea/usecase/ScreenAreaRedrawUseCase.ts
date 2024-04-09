import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description スクリーンエリアを再描画
 *              Redraw screen area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<void> =>
{
    const frame  = movie_clip.currentFrame;
    const layers = movie_clip.layers;
    for (let idx = layers.length - 1; idx > -1; --idx) {
        const layer = layers[idx];

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        const characters = activeCharacters
            .sort((a, b) => a.depth - b.depth);

        for (let idx = 0; idx < characters.length; ++idx) {
            const character = characters[idx];
            await character.draw();
        }
    }
};