import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaMoveDisplayObjectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveDisplayObjectElementUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as characterUpdateYHistoryUseCase } from "@/history/application/core/application/Character/UpdateY/usecase/CharacterUpdateYHistoryUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getMaskMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} y
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
    y: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のx座標を取得
    const beforeY = character.y;

    // 変更がなければ何もしない
    if (beforeY === y) {
        return ;
    }

    // 内部データを更新
    character.y = y;

    // 中心点も移動量に合わせて移動
    character.referencePosition.y += y - beforeY;

    // 履歴を登録
    await characterUpdateYHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeY,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        // 移動したElementを移動
        screenAreaMoveDisplayObjectElementUseCase(layer, character);

        // MovieClipの基準点のElementを再配置
        screenStandardPointDeployElementUseCase();

        if (movie_clip.selectedDepths.size > 0) {

            // 選択範囲のElementを移動
            targetRectUpdateElementUseCase();

            // 選択範囲のバウンディングボックスを取得
            const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
            if (bounds) {
                transformSettingUpdateYElementService(bounds.yMin);
            }
        }

        // マスクのstyleを更新
        if (layer.mode === $MASK_IN_MODE) {
            const element: HTMLElement | null = document
                .getElementById($SCREEN_STAGE_AREA_ID);

            if (!element) {
                return ;
            }

            const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
            if (!node) {
                return ;
            }

            await screenDisplayObjectUpdateMaskInCanvasStyleService(
                node, layer, character.x, y, $getMaskMatrix(character)
            );
        }
    }
};