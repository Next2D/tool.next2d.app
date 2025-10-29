import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectActiveElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectActvieElementService";

/**
 * @description スクリーンへのDisplayObjectの追加表示処理
 *              Process of adding a DisplayObject to the screen
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // アクティブならタイムラインを再描画
    if (movie_clip.active) {
        // タイムラインにフレームを追加
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);

        // 親の基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // 選択範囲のElementの表示を更新
        targetRectUpdateElementUseCase();

        // 変形の中心点の表示を更新
        screenReferencePointDeployElementUseCase();

        // スクリーンエリアにElementを追加
        await screenAreaAppendCharacterService(character, layer);
    } else {
        await screenAreaRedrawUseCase(work_space.scene);

        // 変形の中心点の表示を更新
        screenReferencePointDeployElementUseCase();

        // 再描画したので、選択中のElementをアクティブにする
        const movieClip = work_space.scene;
        for (const [layerIndex, depths] of movieClip.selectedDepths) {

            const layer = movieClip.getLayer(layerIndex);
            if (!layer) {
                continue;
            }

            screenDisplayObjectActiveElementService(layer, depths);
        }
    }
};