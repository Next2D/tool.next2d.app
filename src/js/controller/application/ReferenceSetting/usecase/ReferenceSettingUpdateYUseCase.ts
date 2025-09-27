import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as referenceSettingUpdateCellValueService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService";

/**
 * @description 選択中のDisplayObjectの中心点のy座標を更新する
 *              Update the y coordinate of the center point of the selected DisplayObject
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    y: number
): void => {

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

        const values = movie_clip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movie_clip.currentFrame, values[0]);
        if (!character) {
            return ;
        }

        if (!character.referencePosition.pivot
            || character.referencePosition.pivot !== "none"
        ) {
            const localPosition = character.referencePosition.getLocalPosition();
            character.referencePosition.x = localPosition.x;

            // fixed logic 最後に固定値を外す
            character.referencePosition.pivot = "none";
            referenceSettingUpdateCellValueService("none");
        }

        character.referencePosition.y = y;
    }
};