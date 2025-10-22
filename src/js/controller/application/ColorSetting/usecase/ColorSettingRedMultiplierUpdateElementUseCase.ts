import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as viewColorSettingChangeSvgFromRedMultiplierUseCase } from "@/view/application/usecase/ViewColorSettingChangeSvgFromRedMultiplierUseCase";

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

    // redを更新
    character.colorTransform[0] = Math.floor(red) / 100;

    // 画面に反映
    viewColorSettingChangeSvgFromRedMultiplierUseCase(character, layer);
};