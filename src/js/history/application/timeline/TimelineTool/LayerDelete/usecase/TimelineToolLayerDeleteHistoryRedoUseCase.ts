import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as externalMovieClipRemoveLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipDeleteLayerUseCase";

/**
 * @description レイヤー削除を再度実行する
 *              Execute layer deletion again.
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number
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
    externalMovieClipRemoveLayerUseCase(
        workSpace, movieClip, layer, index
    );
};