import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $getLeftFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateLabelElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateLabelElementService";
import { execute as labelNewRegisterHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LabelNewRegister/usecase/LabelNewRegisterHistoryUseCase";
import { execute as labelUpdateHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LabelUpdate/usecase/LabelUpdateHistoryUseCase";
import { execute as labelDeleteHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LabelDelete/usecase/LabelDeleteHistoryUseCase";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";

/**
 * @description 指定フレームのラベル情報を更新
 *              Update the label information for the specified frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} [label = ""]
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    label: string = "",
    receiver: boolean = false
): void => {

    // labelの値によって分岐
    if (label) {

        // 作業履歴を残す
        if (!movie_clip.hasLabel(frame)) {

            // 初回登録履歴を登録
            labelNewRegisterHistoryUseCase(
                work_space, movie_clip, frame, label, receiver
            );

        } else {

            const beforeLabel = movie_clip.getLabel(frame);

            // 編集履歴を登録
            if (beforeLabel !== label) {
                labelUpdateHistoryUseCase(
                    work_space, movie_clip, frame, label, receiver
                );
            }
        }

        // ラベルを上書き
        movie_clip.setLabel(frame, label);

    } else {

        if (movie_clip.hasLabel(frame)) {

            // 削除履歴を登録
            labelDeleteHistoryUseCase(
                work_space, movie_clip, frame, receiver
            );

            // スクリプトを削除
            movie_clip.deleteLabel(frame);
        }

    }

    // 表示領域にElementがあればclassを更新
    if (work_space.active && movie_clip.active) {

        if (movie_clip.currentFrame === frame) {
            timelineLabelNameUpdateService(label);
        }

        if ($getLeftFrame() <= frame && $getRightFrame() >= frame) {
            const node = timelineHeader.elements[frame - $getLeftFrame()] as HTMLElement;
            if (!node) {
                return ;
            }

            // ラベルアイコンの表示を更新
            timelineHeaderUpdateLabelElementService(node, frame);
        }
    }
};