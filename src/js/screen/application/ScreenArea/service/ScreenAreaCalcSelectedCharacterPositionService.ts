import type { MovieClip } from "@/core/domain/model/MovieClip";
import { PositionImpl } from "@/interface/PositionImpl";

/**
 * @description 選択中のキャラクターのxyの座標位置を計算
 *              Calculate the xy coordinate position of the selected character
 *
 * @param  {MovieClip} movie_clip
 * @return {object}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): PositionImpl | null =>
{
    if (!movie_clip.selectedDepths.size) {
        return null;
    }

    // 選択範囲のElementを表示
    const frame = movie_clip.currentFrame;

    // 選択範囲の左上の位置を取得
    const position = {
        "x": Number.MAX_VALUE,
        "y": Number.MAX_VALUE
    };
    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const layer = movie_clip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            position.x = Math.min(position.x, character.x);
            position.y = Math.min(position.y, character.y);
        }
    }

    if (position.x === Number.MAX_VALUE || position.y === Number.MAX_VALUE) {
        return null;
    }

    return position;
};