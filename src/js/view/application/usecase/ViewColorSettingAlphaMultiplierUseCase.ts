import { execute as colorSettingAlphaMultiplierUpdateElementUseCase } from "@/controller/application/ColorSetting/usecase/ColorSettingAlphaMultiplierUpdateElementUseCase";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 選択中のElementのアルファ値を更新する
 *              Update the alpha value of the selected Element
 *
 * @param  {WorkSpace} work_space 
 * @param  {MovieClip} movie_clip 
 * @param  {number} alpha 
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    alpha: number
): void => {

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size || movie_clip.selectedDepths.size > 1) {
        return ;
    }

    // todo: カラーエリアの値を更新

    // Elementの更新
    colorSettingAlphaMultiplierUpdateElementUseCase(movie_clip, alpha);
};