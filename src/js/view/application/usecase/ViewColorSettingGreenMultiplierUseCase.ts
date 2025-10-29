import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateGreenMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateGreenMultiplierElementValueService";
import { execute as viewColorSettingChangeSvgFromGreenMultiplierUseCase } from "./ViewColorSettingChangeSvgFromGreenMultiplierUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description 選択中のElementの緑色値を更新する
 *              Update the green value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} green
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    green: number
): Promise<void> => {

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // アクティブでない場合は何もしない
    if (work_space.active && movie_clip.active) {
        // Elementの更新
        viewColorSettingChangeSvgFromGreenMultiplierUseCase(character, layer);

        // 選択中のElementがない場合は何もしない
        if (!movie_clip.selectedDepths.size
            || !movie_clip.isSingleSelectedOfDisplayObject()
            || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
        ) {
            return ;
        }

        // カラーエリアの値を更新
        colorSettingUpdateGreenMultiplierElementValueService(green);
    } else {
        // プロジェクトがアクティブならViewエリアを再描画
        if (work_space.active) {
            await screenAreaRedrawUseCase(work_space.scene);
        }
    }
};