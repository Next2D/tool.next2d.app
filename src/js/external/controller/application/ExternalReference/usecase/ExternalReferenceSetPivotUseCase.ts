import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IPivotType } from "@/interface/IPivotType";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalReferencePivotValidation } from "../service/ExternalReferencePivotValidation";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 変形の中心座標を指定ポイントに設定
 *              Set the transformation center point to the specified coordinates
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {IPivotType} pivot
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    pivot: IPivotType
): void => {

    // ワークスペースまたはMovieClipがアクティブでない場合は処理しない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // 選択中のDisplayObjectが無い場合は処理しない
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    // pivot位置が不正な場合は処理しない
    if (!externalReferencePivotValidation(pivot)) {
        return ;
    }

    const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
    if (!bounds) {
        return ;
    }

    if (movie_clip.isSingleSelectedOfDisplayObject()) {
        const layer = movie_clip.getLayer(
            movie_clip.selectedDepths.keys().next().value as number
        );

        if (!layer) {
            return ;
        }

        const depths = movie_clip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(
            movie_clip.currentFrame,
            depths[0]
        );

        if (!character) {
            return ;
        }

        character.referencePosition.pivot = pivot;
    }

    referenceSetting.pivot = pivot;

    // 中心点のElementを再配置
    screenReferencePointDeployElementUseCase();
};