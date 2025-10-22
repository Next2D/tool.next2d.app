import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as viewColorSettingChangeSvgFromBlueOffsetUseCase } from "@/view/application/usecase/ViewColorSettingChangeSvgFromBlueOffsetUseCase";

/**
 * @description スクリーンで選択中のElementのblueを更新する
 *              Update the blue of the selected Element on the screen
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} blue
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    blue: number
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

    // blue offset を更新
    character.colorTransform[6] = Math.floor(blue);

    // 画面に反映
    viewColorSettingChangeSvgFromBlueOffsetUseCase(character, layer);
};