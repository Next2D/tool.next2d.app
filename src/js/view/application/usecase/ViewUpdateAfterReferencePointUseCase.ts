import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as referenceSettingUpdateElementUseCase } from "@/controller/application/ReferenceSetting/usecase/ReferenceSettingUpdateElementUseCase";
import { execute as referenceSettingGetMultiRawPositionUseCase } from "@/controller/application/ReferenceSetting/usecase/ReferenceSettingGetMultiRawPositionUseCase";
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

    // ワークスペースとムービークリップがアクティブな場合は表示を更新
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // セルの表示を更新
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    referenceSetting.clear();
    referenceSetting.pivot = pivot;

    if (movie_clip.isSingleSelectedOfDisplayObject()) {
        const layer = movie_clip.getLayer(
            movie_clip.selectedDepths.keys().next().value as number
        );
        if (!layer) {
            return ;
        }

        const values = movie_clip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movie_clip.currentFrame, values[0]);
        if (!character) {
            return ;
        }

        // ローカル座標を取得してReferenceSettingに設定
        const localPosition  = character.referencePosition.getLocalPosition();
        referenceSettingUpdateElementUseCase(pivot, localPosition.x, localPosition.y);
    } else {
        const position = referenceSettingGetMultiRawPositionUseCase(movie_clip);
        if (!position) {
            return ;
        }

        referenceSettingUpdateElementUseCase(pivot, position.x, position.y);
    }

    // 中心点のElementを再配置
    screenReferencePointDeployElementUseCase();
};