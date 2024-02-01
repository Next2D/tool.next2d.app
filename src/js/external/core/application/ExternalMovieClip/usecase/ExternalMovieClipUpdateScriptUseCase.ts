import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { execute as scriptEditorNewRegisterHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUseCase";
import { execute as scriptEditorUpdateHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUseCase";
import { execute as scriptEditorDeleteHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUseCase";
import { $getLeftFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as scriptAreaReloadUseCase } from "@/controller/application/ScriptArea/usecase/ScriptAreaReloadUseCase";

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

    let doReload = false;

    // scriptの値によって分岐
    if (script) {

        // 作業履歴を残す
        if (!movie_clip.hasAction(frame)) {

            // 初回登録履歴を登録
            scriptEditorNewRegisterHistoryUseCase(
                work_space, movie_clip, frame, script
            );

            if (work_space.active) {
                doReload = true;
            }

        } else {

            const beforeScript = movie_clip.getAction(frame);

            // 編集履歴を登録
            if (beforeScript !== script) {
                scriptEditorUpdateHistoryUseCase(movie_clip, frame, script);

                if (work_space.active) {
                    doReload = true;
                }
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

            if (work_space.active) {
                doReload = true;
            }
        }

    }

    // JavaScriptタブを再描画
    if (doReload) {
        scriptAreaReloadUseCase();
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