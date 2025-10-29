import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateRedOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedOffsetElementValueService";
import { execute as viewColorSettingChangeSvgFromRedOffsetUseCase } from "./ViewColorSettingChangeSvgFromRedOffsetUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description 選択中のElementの赤色オフセット値を更新する
 *              Update the red offset value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} red
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    red: number
): void => {

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

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
};