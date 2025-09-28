import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { execute as referenceSettingUpdateYHistoryUseCase } from "@/history/application/controller/application/ReferenceSetting/UpdateY/usecase/ReferenceSettingUpdateYHistoryUseCase";
import { execute as viewReferenceSettingUpdatePositionUseCase } from "@/view/application/usecase/ViewReferenceSettingUpdatePositionUseCase";

/**
 * @description 中心点のy座標を設定するユースケース
 *              Use case for setting the y-coordinate of the center point
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} y
 * @param  {Layer | null} layer
 * @param  {Character | null} character
 * @param  {boolean} receiver
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    y: number,
    layer: Layer | null = null,
    character: Character | null = null,
    receiver: boolean = false
): Promise<void> => {

    // 選択中のDisplayObjectが無い場合は処理しない
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    if (referenceSetting.y === y) {
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
        await referenceSettingUpdateYHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            character,
            y,
            receiver
        );

        // 座標を更新
        const localPosition = character.referencePosition.getLocalPosition();
        character.referencePosition.x = localPosition.x;
        character.referencePosition.y = y;
        character.referencePosition.pivot = "none";

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
            referenceSetting.pivot = "none";
            referenceSetting.x = character.referencePosition.x;
            referenceSetting.y = character.referencePosition.y;
        }
    } else {
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
            await referenceSettingUpdateYHistoryUseCase(
                work_space,
                movie_clip,
                layer,
                character,
                y,
                receiver
            );

            // 座標を更新
            const localPosition = character.referencePosition.getLocalPosition();
            character.referencePosition.x = localPosition.x;
            character.referencePosition.y = y;
            character.referencePosition.pivot = "none";

            // 表示の更新
            referenceSetting.clear();
            referenceSetting.pivot = "none";
            referenceSetting.x = character.referencePosition.x;
            referenceSetting.y = character.referencePosition.y;
        } else {
            // 内部情報を更新
            referenceSetting.movementY = y - referenceSetting.beforeY;
        }
    }

    // 表示の更新
    viewReferenceSettingUpdatePositionUseCase(work_space, movie_clip);
};