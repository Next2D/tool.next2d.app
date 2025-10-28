import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateBlueMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateBlueMultiplierElementValueService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { execute as viewColorSettingChangeSvgFromBlueMultiplierUseCase } from "./ViewColorSettingChangeSvgFromBlueMultiplierUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { $removeLibraryCache } from "@/cache/CacheUtil";

/**
 * @description 選択中のElementの青色値を更新する
 *              Update the blue value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} blue
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    blue: number
): Promise<void> => {

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // 自分のキャッシュを削除する
    $removeLibraryCache(work_space.id, movie_clip.id);

    // アクティブでない場合は何もしない
    if (work_space.active && movie_clip.active) {

        // Elementの更新
        viewColorSettingChangeSvgFromBlueMultiplierUseCase(character, layer);

        // 選択中のElementがない場合は何もしない
        if (!movie_clip.selectedDepths.size
            || !movie_clip.isSingleSelectedOfDisplayObject()
            || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
        ) {
            return ;
        }

        // カラーエリアの値を更新
        colorSettingUpdateBlueMultiplierElementValueService(blue);

    } else {
        // プロジェクトがアクティブならViewエリアを再描画
        if (work_space.active) {
            await screenAreaRedrawUseCase(work_space.scene);
        }
    }
};