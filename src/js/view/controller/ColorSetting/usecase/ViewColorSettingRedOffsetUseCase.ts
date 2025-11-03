import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateRedOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedOffsetElementValueService";
import { execute as viewColorSettingChangeSvgFromRedOffsetUseCase } from "./ViewColorSettingChangeSvgFromRedOffsetUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 選択中のElementの赤色オフセット値を更新する
 *              Update the red offset value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} red
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    red: number
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // アクティブでない場合は何もしない
    if (movie_clip.active) {
        // Elementの更新
        viewColorSettingChangeSvgFromRedOffsetUseCase(character, layer);

        // 選択中のElementがない場合は何もしない
        if (!movie_clip.selectedDepths.size
            || !movie_clip.isSingleSelectedOfDisplayObject()
            || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
        ) {
            return ;
        }

        // カラーエリアの値を更新
        colorSettingUpdateRedOffsetElementValueService(red);
    } else {
        await screenAreaRedrawUseCase(work_space.scene);
    }
};