import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateRedMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedMultiplierElementValueService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { execute as viewColorSettingChangeSvgFromRedMultiplierUseCase } from "./ViewColorSettingChangeSvgFromRedMultiplierUseCase";

/**
 * @description 選択中のElementの赤色値を更新する
 *              Update the red value of the selected Element
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

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // redを更新
    viewColorSettingChangeSvgFromRedMultiplierUseCase(character, layer);

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    // カラーエリアの値を更新
    colorSettingUpdateRedMultiplierElementValueService(red);
};