import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as elsexternalCharacterUpdateScaleXUseCase } from "./ExternalCharacterUpdateScaleXUseCase";

/**
 * @description 指定の幅に変更
 *              Change to specified width
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} width
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    width: number
): Promise<void> => {
    const bounds = character.getRawBounds();
    if (!bounds) {
        return;
    }

    const scaleX = width / Math.abs(bounds.xMax - bounds.xMin);
    await elsexternalCharacterUpdateScaleXUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        scaleX
    );
};