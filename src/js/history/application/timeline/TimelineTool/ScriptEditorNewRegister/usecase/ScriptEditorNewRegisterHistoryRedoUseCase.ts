import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { $TIMELINE_HEADER_ID } from "@/config/TimelineConfig";

/**
 * @description 削除したスクリプトを元のフレームに戻す
 *              Restore deleted scripts to their original frame.
 *
 * @param  {number} frame
 * @param  {string} script
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, script: string): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .setAction(frame, script);

    // 表示領域にあればアイコンを更新
    if ($getLeftFrame() <= frame
        && $getRightFrame() >= frame
    ) {
        const element: HTMLElement | null = document
            .getElementById($TIMELINE_HEADER_ID);

        if (!element) {
            return ;
        }

        const node = element.children[frame - $getLeftFrame()] as HTMLElement;
        if (!node) {
            return ;
        }

        // ヘッダーの表示を更新
        timelineHeaderUpdateScriptElementService(node, frame);
    }
};