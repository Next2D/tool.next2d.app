import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateAlphaMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateAlphaMultiplierElementValueService";
import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 選択中のElementのアルファ値を更新する
 *              Update the alpha value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} alpha
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    alpha: number
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // アクティブでない場合は何もしない
    if (movie_clip.active) {

        // Elementの更新
        const element = screenAreaGetElementFromCharacterIdService(character.id);
        if (element) {
            // alphaを更新
            const canvas = element.querySelector("canvas");
            if (canvas) {
                canvas.style.opacity = `${character.alpha}`;
            }
        }

        // 選択中のElementがない場合は何もしない
        if (!movie_clip.selectedDepths.size
            || !movie_clip.isSingleSelectedOfDisplayObject()
            || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
        ) {
            return ;
        }

        // カラーエリアの値を更新
        colorSettingUpdateAlphaMultiplierElementValueService(alpha);
    } else {
        // プロジェクトがアクティブならViewエリアを再描画
        await screenAreaRedrawUseCase(work_space.scene);
    }
};