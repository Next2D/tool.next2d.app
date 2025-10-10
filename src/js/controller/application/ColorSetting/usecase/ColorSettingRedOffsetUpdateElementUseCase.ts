import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description スクリーンで選択中のElementのredを更新する
 *              Update the red of the selected Element on the screen
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} red
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    red: number
): void => {

    // 選択中のelementがない場合、複数選択時は何もしない
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

    const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
    if (!node) {
        return ;
    }

    const container = node.querySelector(".canvas-container") as HTMLDivElement;
    if (!container) {
        return ;
    }

    // red offset を更新
    character.colorTransform[4] = Math.floor(red);

    // 画面に反映
    const colorTransform = character.colorTransform;
    const r = Math.max(0, Math.min(255 * colorTransform[0] + colorTransform[4], 255));
    const g = Math.max(0, Math.min(255 * colorTransform[1] + colorTransform[5], 255));
    const b = Math.max(0, Math.min(255 * colorTransform[2] + colorTransform[6], 255));
    container.style.setProperty("--color-transform", `${r} ${g} ${b}`);
};