import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { execute as scriptEditorNewRegisterHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUseCase";
import { execute as scriptEditorUpdateHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUseCase";
import { execute as scriptEditorDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUseCase";
import { $getLeftFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description 指定フレームのスクリプト情報を更新
 *              Update script information for specified frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} script
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    script: string
): void => {

    // scriptの値によって分岐
    if (script) {

        // 作業履歴を残す
        if (!movie_clip.hasAction(frame)) {
            // 初回登録履歴を登録
            scriptEditorNewRegisterHistoryUseCase(movie_clip, frame, script);
        } else {
            const beforeScript = movie_clip.getAction(frame);

            // 編集履歴を登録
            if (beforeScript !== script) {
                scriptEditorUpdateHistoryUseCase(movie_clip, frame, script);
            }
        }

        // スクリプトを上書き
        movie_clip.setAction(frame, script);
    } else {

        if (movie_clip.hasAction(frame)) {
            // 削除履歴を登録
            scriptEditorDeleteHistoryUseCase(movie_clip, frame);

            // スクリプトを削除
            movie_clip.deleteAction(frame);
        }

    }

    // 表示領域にElementがあればclassを更新
    if (work_space.active && movie_clip.active
        && $getLeftFrame() <= frame
        && $getRightFrame() >= frame
    ) {
        const node = timelineHeader.elements[frame - $getLeftFrame()] as HTMLElement;
        if (!node) {
            return ;
        }

        // スクリプトアイコンの更新
        timelineHeaderUpdateScriptElementService(node, frame);
    }
};