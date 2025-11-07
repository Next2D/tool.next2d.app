import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";
import { execute as screenParentStandardPointDeployElementUseCass } from "@/screen/application/StandardPoint/usecase/ScreenParentStandardPointDeployElementUseCase";

/**
 * @description xスケールを更新した際のViewエリアの表示要素を更新
 *              Update the display elements in the View area when the x scale is updated
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
        return;
    }

    // 変形の中心点のElementを再配置
    screenReferencePointDeployElementUseCase();

    // 選択範囲のElementを移動
    targetRectUpdateElementUseCase();

    // アクティブなら表示を更新
    if (movie_clip.active) {

        if (movie_clip.selectedDepths.size) {

            if (movie_clip.isSingleSelectedOfDisplayObject()) {
                // 変更対象のDisplayObjectを選択中であれば、xスケールの値を更新
                if (screenAreaIsCharacterSelectedService(movie_clip, layer, character)) {
                    // MovieClipの基準点のElementを再配置
                    screenStandardPointDeployElementUseCase();

                    // 変形エリアのxスケールの値を更新
                    transformSettingUpdateScaleXElementService(
                        Math.round(character.scaleX * 10000) / 100
                    );
                }
            } else {

                // 選択範囲のElementを移動
                targetRectUpdateElementUseCase();

                // 選択範囲のバウンディングボックスを取得
                transformSettingUpdateScaleXElementService(100);
            }
        }

        const element = screenAreaGetElementFromCharacterIdService(character.id);
        if (element) {
            await screenAreaReplaceCanvasUseCase(character, element, layer);

            // マスクのstyleを更新
            if (layer.mode === $MASK_IN_MODE) {
                await screenDisplayObjectUpdateMaskInCanvasStyleService(element, layer, character);
            }
        }
    } else {
        // プロジェクトがアクティブならViewエリアを再描画
        await screenAreaRedrawUseCase(work_space.scene);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(work_space.scene);

        // 親MovieClipの基準点Elementを再配置
        screenParentStandardPointDeployElementUseCass();
    }
};