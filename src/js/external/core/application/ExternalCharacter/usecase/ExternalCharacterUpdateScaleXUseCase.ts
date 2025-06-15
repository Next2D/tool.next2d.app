import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $removeLibraryCache } from "@/cache/CacheUtil";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as characterUpdateScaleXHistoryUseCase } from "@/history/application/core/application/Character/UpdateScaleX/usecase/CharacterUpdateScaleXHistoryUseCase";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";

/**
 * @description DisplayObjectのxスケールを更新
 *              Update the x scale of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} scale_x
 * @param  {boolean} [receiver=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    scale_x: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のXスケールを取得
    const beforeScaleX = character.scaleX;

    // 変更がなければ何もしない
    if (beforeScaleX === scale_x) {
        return ;
    }

    // 内部データを更新
    character.scaleX = scale_x;

    // 変形の基準点を移動
    character.referencePosition.x /= beforeScaleX;
    character.referencePosition.x *= scale_x;

    // 履歴を登録
    await characterUpdateScaleXHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeScaleX,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        if (!transformSetting.sizeLocked && !transformSetting.scaleLocked) {
            const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
            if (element) {
                await screenAreaReplaceCanvasUseCase(
                    character,
                    element,
                    layer
                );
            }
        }

        if (movie_clip.selectedDepths.size > 0) {
            // 選択範囲のElementを移動
            if (!transformSetting.sizeLocked && !transformSetting.scaleLocked) {
                targetRectUpdateElementUseCase();
            }

            // 選択範囲のバウンディングボックスを取得
            const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
            if (bounds) {
                transformSettingUpdateWidthElementService(Math.abs(bounds.xMax - bounds.xMin));
            }

            // 選択範囲のバウンディングボックスを取得
            if (movie_clip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateScaleXElementService(character.scaleX * 100);
            } else {
                if (bounds) {
                    transformSettingUpdateScaleXElementService(bounds.xMin);
                }
            }
        }
    }

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space.id);

    // 自分のキャッシュを削除する
    $removeLibraryCache(work_space.id, movie_clip.id);
};