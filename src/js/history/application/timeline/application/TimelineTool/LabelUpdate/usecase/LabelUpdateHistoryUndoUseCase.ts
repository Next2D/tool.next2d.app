import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateLabelElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateLabelElementService";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

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

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    // 内部情報を更新
    movieClip.setLabel(frame, before_label);

    // ラベル名の表示を更新
    if (workSpace.active && movieClip.active) {

        // ラベル名の表示を更新
        if (movieClip.currentFrame === frame) {
            timelineLabelNameUpdateService(before_label);
        }

        if ($getLeftFrame() <= frame && $getRightFrame() >= frame) {
            const node = timelineHeader.elements[frame - $getLeftFrame()] as HTMLElement;
            if (!node) {
                return ;
            }

            // ヘッダーの表示を更新
            timelineHeaderUpdateLabelElementService(node, frame);
        }
    }
};