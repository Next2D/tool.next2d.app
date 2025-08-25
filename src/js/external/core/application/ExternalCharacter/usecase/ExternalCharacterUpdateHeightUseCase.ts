import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalCharacterUpdateScaleYUseCase } from "./ExternalCharacterUpdateScaleYUseCase";

/**
 * @description 指定の高さに変更
 *              Change to specified height
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} height
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    height: number
): Promise<void> => {
    const bounds = character.getRawBounds();
    if (!bounds) {
        return;
    }

    const scaleY = height / Math.abs(bounds.yMax - bounds.yMin);
    await externalCharacterUpdateScaleYUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        scaleY
    );
};