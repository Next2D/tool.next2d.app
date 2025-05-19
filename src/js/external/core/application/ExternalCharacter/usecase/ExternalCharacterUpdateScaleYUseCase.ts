import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as characterUpdateScaleYHistoryUseCase } from "@/history/application/core/application/Character/UpdateScaleY/usecase/CharacterUpdateScaleYHistoryUseCase";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as transformSettingUpdateScaleYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService";
import { execute as transformSettingUpdateHeightElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateHeightElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description DisplayObjectのyスケールを更新
 *              Update the y scale of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} scale_y
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
    scale_y: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のYスケールを取得
    const beforeScaleY = character.scaleY;

    // 変更がなければ何もしない
    if (beforeScaleY === scale_y) {
        return ;
    }

    // 内部データを更新
    character.scaleY = scale_y;

    // 履歴を登録
    await characterUpdateScaleYHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeScaleY,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
        if (element) {
            await screenAreaReplaceCanvasUseCase(
                character,
                element,
                layer
            );
        }

        if (movie_clip.selectedDepths.size > 0) {
            // 選択範囲のElementを移動
            targetRectUpdateElementUseCase();

            // 選択範囲のバウンディングボックスを取得
            const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
            if (bounds) {
                transformSettingUpdateHeightElementService(Math.abs(bounds.yMax - bounds.yMin));
            }

            // 選択範囲のバウンディングボックスを取得
            if (movie_clip.selectedDepths.size === 1) {
                for (const [layerIndex, depths] of movie_clip.selectedDepths) {
                    const selectedLayer = movie_clip.getLayer(layerIndex);
                    if (!selectedLayer) {
                        break;
                    }

                    if (selectedLayer.id === layer.id
                        && depths[0] === character.depth
                    ) {
                        transformSettingUpdateScaleYElementService(character.scaleY * 100);
                    }
                }
            }
        }
    }
};