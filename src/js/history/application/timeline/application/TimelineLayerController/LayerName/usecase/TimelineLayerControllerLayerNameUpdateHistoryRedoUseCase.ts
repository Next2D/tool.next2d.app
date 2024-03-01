import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineLayerControllerUpdateNameElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateNameElementService";

/**
 * @description レイヤー名の更新後の状態に進める
 *              Proceed to the state after updating the layer name.
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
    after_name: string
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

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        timelineLayerControllerUpdateNameElementService(layer, after_name);
    }

    // レイヤー名を更新
    layer.name = after_name;
};