import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";
import {
    $getCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description タイムラインに新規レイヤーを追加する
 *              Adding a new layer to the timeline
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number = 0,
    library_id: number = -1
): void => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = work_space_id !== 0
        ? $getWorkSpace(work_space_id)
        : $getCurrentWorkSpace();

    if (!workSpace) {
        return ;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const scene: InstanceImpl<MovieClip>  = library_id === -1
        ? workSpace.scene
        : workSpace.getLibrary(library_id);

    if (!scene) {
        return ;
    }

    // レイヤーを追加
    externalMovieClipCreateLayerUseCase(workSpace, scene);
};