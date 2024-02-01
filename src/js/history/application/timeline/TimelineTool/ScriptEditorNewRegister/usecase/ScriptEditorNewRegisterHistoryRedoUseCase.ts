import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as scriptAreaReloadUseCase } from "@/controller/application/ScriptArea/usecase/ScriptAreaReloadUseCase";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

/**
 * @description 削除したスクリプトを元のフレームに戻す
 *              Restore deleted scripts to their original frame.
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} frame
 * @param  {string} script
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number,
    script: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // スクリプトを上書き
    movieClip.setAction(frame, script);

    if (workSpace.active && movieClip.active) {

        // スクリプトエリアを再描画
        scriptAreaReloadUseCase();

        // 表示領域にあればアイコンを更新
        if ($getLeftFrame() <= frame && $getRightFrame() >= frame) {

            const node = timelineHeader.elements[frame - $getLeftFrame()] as HTMLElement;
            if (!node) {
                return ;
            }

            // ヘッダーの表示を更新
            timelineHeaderUpdateScriptElementService(node, frame);
        }
    }
};