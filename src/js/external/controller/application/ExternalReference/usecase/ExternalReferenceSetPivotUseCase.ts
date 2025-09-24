import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IPivotType } from "@/interface/IPivotType";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalReferencePivotValidation } from "../service/ExternalReferencePivotValidation";
import { execute as viewUpdateAfterReferencePointUseCase } from "@/view/application/usecase/ViewUpdateAfterReferencePointUseCase";
import { execute as referenceSettingUpdatePivotHistoryUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdatePivot/usecase/ReferenceSettingUpdatePivotHistoryUseCase";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 変形の中心座標を指定ポイントに設定
 *              Set the transformation center point to the specified coordinates
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {IPivotType} pivot
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    pivot: IPivotType
): Promise<void> => {

    // 選択中のDisplayObjectが無い場合は処理しない
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    // pivot位置が不正な場合は処理しない
    if (!externalReferencePivotValidation(pivot)) {
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

        // 履歴を登録
        // fixed logic: 更新前に履歴に残す
        await referenceSettingUpdatePivotHistoryUseCase(
            work_space, movie_clip, layer, character,
            referenceSetting.pivot, pivot
        );

        character.referencePosition.pivot = pivot;
    }

    // 表示を更新
    viewUpdateAfterReferencePointUseCase(work_space, movie_clip, pivot);
};