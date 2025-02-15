import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { execute as scriptEditorNewRegisterHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUseCase";
import { execute as scriptEditorUpdateHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorUpdate/usecase/ScriptEditorUpdateHistoryUseCase";
import { execute as scriptEditorDeleteHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/ScriptEditorDelete/usecase/ScriptEditorDeleteHistoryUseCase";
import { execute as scriptAreaReloadUseCase } from "@/controller/application/ScriptArea/usecase/ScriptAreaReloadUseCase";
import { execute as scriptAreaScrollUpdateHeightService } from "@/controller/application/ScriptAreaScroll/service/ScriptAreaScrollUpdateHeightService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

/**
 * @description 指定フレームのスクリプト情報を更新
 *              Update script information for specified frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {string} [script = ""]
 * @param  {boolean} [receiver = false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    script: string = "",
    receiver: boolean = false
): Promise<void> => {

    let doReload = false;

    // scriptの値によって分岐
    if (script) {

        // 作業履歴を残す
        if (!movie_clip.hasAction(frame)) {

            // 初回登録履歴を登録
            await scriptEditorNewRegisterHistoryUseCase(
                work_space, movie_clip, frame, script, receiver
            );

            if (work_space.active) {
                doReload = true;
            }

        } else {

            const beforeScript = movie_clip.getAction(frame);

            // 編集履歴を登録
            if (beforeScript !== script) {
                await scriptEditorUpdateHistoryUseCase(
                    work_space, movie_clip, frame, script, receiver
                );

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
            await scriptEditorDeleteHistoryUseCase(
                work_space, movie_clip, frame, receiver
            );

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

        // スクロールバーの高さを更新
        scriptAreaScrollUpdateHeightService();
    }
};