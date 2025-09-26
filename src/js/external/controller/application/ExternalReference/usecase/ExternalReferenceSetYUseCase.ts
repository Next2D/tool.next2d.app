import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
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
            character.referencePosition.y,
            y
        );

        // y座標を更新
        character.referencePosition.y = y;
    }

    // 表示の更新
    viewReferenceSettingUpdatePositionUseCase(work_space, movie_clip);
};