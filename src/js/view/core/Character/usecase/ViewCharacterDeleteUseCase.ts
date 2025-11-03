import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";

/**
 * @description キャラクター削除後の表示処理
 *             Display processing after deleting a character
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

    // スクリーンの選択範囲elementを非表示
    targetRectHideElementService();

    // 変形の中心点の表示を更新
    screenReferencePointDeployElementUseCase();

    if (movie_clip.active) {
        const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
        if (element) {
            element.remove();
        }
    } else {
        await screenAreaRedrawUseCase(work_space.scene);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(work_space.scene);
    }
};