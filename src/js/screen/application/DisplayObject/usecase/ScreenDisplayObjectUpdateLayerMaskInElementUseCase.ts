import { $GUIDE_MODE } from "@/config/LayerModeConfig";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenDisplayObjectAllResetMaskStyleUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllResetMaskStyleUseCase";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { $getMaskMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description レイヤーに配置された全てのDisplayObjectのマスクスタイルをレイヤーの状態に合わせて更新
 *              Update the mask style of all DisplayObjects placed on the layer according to the state of the layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip, layer: Layer): Promise<void> =>
{
    // 非表示中なら処理を終了
    if (layer.disable) {
        return ;
    }

    const activeCharacters = layer.getActiveCharacters(movie_clip.currentFrame);
    if (!activeCharacters.length) {
        return ;
    }

    // 親レイヤーが存在しない場合は、マスクのスタイルをリセット
    if (layer.parentId === -1) {
        screenDisplayObjectAllResetMaskStyleUseCase(movie_clip, layer);
        return ;
    }

    const parentLayer = movie_clip.getLayerById(layer.parentId);
    if (!parentLayer || parentLayer.mode === $GUIDE_MODE) {
        return ;
    }

    if (parentLayer.lock) {

        const element: HTMLElement | null = document
            .getElementById($SCREEN_STAGE_AREA_ID);

        if (!element) {
            return ;
        }

        for (let idx = 0; idx < activeCharacters.length; ++idx) {

            const character = activeCharacters[idx];
            if (!character) {
                continue;
            }

            const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
            if (!element) {
                continue;
            }

            await screenDisplayObjectUpdateMaskInCanvasStyleService(
                element,
                layer,
                character.x,
                character.y,
                $getMaskMatrix(character)
            );
        }

    } else {
        // ロック状態でなければ、マスクのスタイルをリセット
        screenDisplayObjectAllResetMaskStyleUseCase(movie_clip, layer);
    }
};