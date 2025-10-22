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
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    const layer = movie_clip.getLayer(
        movie_clip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        return ;
    }

    const values = movie_clip.selectedDepths.values().next().value as number[];

    const depth = values[0];
    const character = layer.getCharacter(movie_clip.currentFrame, depth);
    if (!character) {
        return ;
    }

    const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
    if (!element) {
        return ;
    }

    // alphaを更新
    character.colorTransform[7] = Math.floor(alpha);

    // canvasのopacityを更新
    const canvas = element.querySelector("canvas");
    if (canvas) {
        canvas.style.opacity = `${character.alpha}`;
    }
};