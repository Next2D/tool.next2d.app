import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateGreenOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateGreenOffsetElementValueService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { execute as viewColorSettingChangeSvgFromGreenOffsetUseCase } from "./ViewColorSettingChangeSvgFromGreenOffsetUseCase";

/**
 * @description 選択中のElementの緑色オフセット値を更新する
 *              Update the green offset value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} green
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    green: number
): void => {

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // Elementの更新
    viewColorSettingChangeSvgFromGreenOffsetUseCase(character, layer);

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    // カラーエリアの値を更新
    colorSettingUpdateGreenOffsetElementValueService(green);
};