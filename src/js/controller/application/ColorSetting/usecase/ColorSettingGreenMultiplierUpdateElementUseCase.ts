import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as viewColorSettingChangeSvgFromGreenMultiplierUseCase } from "@/view/application/usecase/ViewColorSettingChangeSvgFromGreenMultiplierUseCase";

/**
 * @description スクリーンで選択中のElementのgreenを更新する
 *              Update the green of the selected Element on the screen
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} green
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    green: number
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

    // greenを更新
    character.colorTransform[1] = Math.floor(green) / 100;

    // 画面に反映
    viewColorSettingChangeSvgFromGreenMultiplierUseCase(character, layer);
};