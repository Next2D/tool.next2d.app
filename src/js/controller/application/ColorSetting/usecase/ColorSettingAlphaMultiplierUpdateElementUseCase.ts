import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description スクリーンで選択中のElementのalphaを更新する
 *              Update the alpha of the selected Element on the screen
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} alpha
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    alpha: number
): void => {

    // 選択中のelementがない場合は何もしない
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const layer = movie_clip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        for (let idx = 0; idx < depths.length; ++idx) {

            const depth = depths[idx];

            const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
            if (!node) {
                continue ;
            }

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue ;
            }

            // alphaを更新
            character.colorTransform[3] = alpha / 100;

            const canvas = node.querySelector("canvas");
            if (canvas) {
                canvas.style.opacity = `${character.alpha}`;
            }
        }
    }
};