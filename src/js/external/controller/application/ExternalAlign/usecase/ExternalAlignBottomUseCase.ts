import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description 選択範囲の下端に合わせて選択中のキャラクターを移動
 *              Move the selected character to the bottom edge of the selection
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace, movie_clip: MovieClip): Promise<void> =>
{
    if (!movie_clip.selectedDepths.size) {
        return ;
    }

    const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
    if (!bounds) {
        return ;
    }

    const bottomY = bounds.yMax;
    const frame = movie_clip.currentFrame;
    for (const [layerIndex, depths] of movie_clip.selectedDepths) {

        const layer = movie_clip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            // 現在の境界を取得
            const bounds = character.getBounds(frame);
            if (!bounds) {
                continue ;
            }

            // 目標のy座標 = 選択範囲の下端(bottomY) + 現在のオフセット(character.y - bounds.yMax)
            const dy = bottomY + (character.y - bounds.yMax);

            const externalCharacter = new ExternalCharacter(
                work_space,
                movie_clip,
                layer,
                character
            );
            await externalCharacter.setY(dy);
        }
    }
};