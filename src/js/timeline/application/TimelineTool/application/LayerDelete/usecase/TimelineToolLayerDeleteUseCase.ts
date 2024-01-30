import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import {
    $getCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description タイムラインの指定レイヤーを削除する
 *              Deleting a specified layer of the timeline
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

    // 選択されたレイヤーがなければ終了
    const selectedLayers = scene.selectedLayers;
    if (!selectedLayers.length) {
        return ;
    }

    // タイムラインのAPIを起動
    const externalTimeline = new ExternalTimeline(workSpace, scene);
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];

        // レイヤーのAPIを起動
        const externalLayer = new ExternalLayer(workSpace, scene, layer);
        externalTimeline.removeLayer(externalLayer.index);
    }
};