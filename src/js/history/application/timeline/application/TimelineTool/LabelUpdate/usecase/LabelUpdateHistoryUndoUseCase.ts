import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";

/**
 * @description 変更前のラベル名に戻す
 *              Revert to the previous label name
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} frame
 * @param  {string} before_label
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number,
    before_label: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    movieClip.setAction(frame, before_label);

    // ラベル名の表示を更新
    if (workSpace.active && movieClip.active
        && movieClip.currentFrame === frame
    ) {
        timelineLabelNameUpdateService(before_label);
    }
};