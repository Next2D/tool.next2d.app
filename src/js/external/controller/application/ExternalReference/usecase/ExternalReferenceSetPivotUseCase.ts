import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IPivotType } from "@/interface/IPivotType";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalReferencePivotValidation } from "../service/ExternalReferencePivotValidation";
import { execute as viewReferenceSettingUpdatePivotUseCase } from "@/view/application/usecase/ViewReferenceSettingUpdatePivotUseCase";
import { execute as referenceSettingUpdatePivotHistoryUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdatePivot/usecase/ReferenceSettingUpdatePivotHistoryUseCase";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 変形の中心座標を指定ポイントに設定
 *              Set the transformation center point to the specified coordinates
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {IPivotType} pivot
 * @param  {Layer | null} [layer=null]
 * @param  {Character | null} [character=null]
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    pivot: IPivotType,
    layer: Layer | null = null,
    character: Character | null = null,
    receiver: boolean = false
): Promise<void> => {

    // pivot位置が不正な場合は処理しない
    if (!externalReferencePivotValidation(pivot)) {
        return ;
    }

    if (layer && character) {

        const cloneSelectedDepths = Array.from(movie_clip.selectedDepths);
        movie_clip.selectedDepths.clear();
        movie_clip.selectedDepths.set(
            movie_clip.layers.indexOf(layer), [character.depth]
        );

        // 履歴を登録
        // fixed logic: 更新前に履歴に残す
        await referenceSettingUpdatePivotHistoryUseCase(
            work_space, movie_clip, layer, character,
            referenceSetting.pivot, pivot, receiver
        );

        character.referencePosition.pivot = pivot;

        // 選択情報を復元
        movie_clip.selectedDepths.clear();
        for (let idx = 0; idx < cloneSelectedDepths.length; idx++) {
            const values = cloneSelectedDepths[idx];
            if (!values) {
                continue ;
            }

            movie_clip.selectedDepths.set(values[0], values[1]);
        }

        // 選択中のDisplayObjectが無い場合は処理しない
        if (!movie_clip.active || !movie_clip.selectedDepths.size) {
            return ;
        }

        // 同一のDisplayObjectが選択されている場合のみ、表示を更新
        if (movie_clip.isSingleSelectedOfDisplayObject()) {
            const selectedLayer = movie_clip.getLayer(
                movie_clip.selectedDepths.keys().next().value as number
            );

            if (!selectedLayer) {
                return ;
            }

            if (selectedLayer !== layer) {
                return ;
            }

            const depths = movie_clip.selectedDepths.values().next().value as number[];
            const selectedCharacter = selectedLayer.getCharacter(
                movie_clip.currentFrame,
                depths[0]
            );

            if (!selectedCharacter) {
                return ;
            }

            if (selectedCharacter !== character) {
                return ;
            }

            // 表示の更新
            referenceSetting.clear();
            referenceSetting.pivot = pivot;
        }

    } else {
        // 選択中のDisplayObjectが無い場合は処理しない
        if (!movie_clip.selectedDepths.size) {
            return ;
        }

        // 単一のDisplayObjectが選択されている場合のみ、履歴を残す
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
                referenceSetting.pivot, pivot, receiver
            );

            character.referencePosition.pivot = pivot;
        } else {
            referenceSetting.clear();
            referenceSetting.pivot = pivot;
        }
    }

    // 表示を更新
    viewReferenceSettingUpdatePivotUseCase(work_space, movie_clip, pivot);
};