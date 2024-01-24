import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";

/**
 * @description レイヤー名の変更を元に戻す
 *              Undo Layer Name Changes
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    name: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    const elementUpdate: boolean = workSpace.active && movieClip.active;
    externalLayerUpdateNameUseCase(
        workSpace, movieClip, layer, name, elementUpdate
    );
};