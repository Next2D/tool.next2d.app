import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { execute as screenAreaMoveDisplayObjectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveDisplayObjectElementUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectActiveElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectActvieElementService";

/**
 * @description y座標を更新した際のViewエリアの表示要素を更新
 *              Update the display elements in the View area when the y coordinate is updated
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

    // アクティブなら表示を更新
    if (movie_clip.active) {

        // 表示Elementを移動
        screenAreaMoveDisplayObjectElementUseCase(layer, character);

        if (movie_clip.selectedDepths.size) {

            // 変形の中心点のElementを再配置
            screenReferencePointDeployElementUseCase();

            if (movie_clip.isSingleSelectedOfDisplayObject()) {
                // 変更対象のDisplayObjectを選択中であれば、x座標の値を更新
                if (screenAreaIsCharacterSelectedService(movie_clip, layer, character)) {
                    // MovieClipの基準点のElementを再配置
                    screenStandardPointDeployElementUseCase();

                    // 変形エリアのx座標の値を更新
                    transformSettingUpdateYElementService(character.y);
                }
            } else {

                // 選択範囲のElementを移動
                targetRectUpdateElementUseCase();

                // 選択範囲のバウンディングボックスを取得
                const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
                if (bounds) {
                    transformSettingUpdateYElementService(bounds.yMin);
                }
            }
        }

        // マスクのstyleを更新
        if (layer.mode === $MASK_IN_MODE) {
            const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
            if (!element) {
                return;
            }

            // マスクのstyleを更新
            await screenDisplayObjectUpdateMaskInCanvasStyleService(element, layer, character);
        }

    } else {
        await screenAreaRedrawUseCase(work_space.scene);

        // 変形の中心点のElementを再配置
        screenReferencePointDeployElementUseCase();

        // 選択範囲のElementを移動
        targetRectUpdateElementUseCase();

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