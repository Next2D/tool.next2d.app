import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateLabelElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateLabelElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

/**
 * @description 追加したラベルを削除して元に戻す
 *              Remove the added label and revert it
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    // スクリプトを削除
    movieClip.deleteLabel(frame);

    if (workSpace.active && movieClip.active) {

        // ラベル名の表示を更新
        if (movieClip.currentFrame === frame) {
            timelineLabelNameUpdateService("");
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