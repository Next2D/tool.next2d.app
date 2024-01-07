import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { $TIMELINE_HEADER_ID } from "@/config/TimelineConfig";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

/**
 * @description 追加したスクリプトを削除して元に戻す
 *              Delete and revert scripts that you have added.
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    // スクリプトを削除
    $getCurrentWorkSpace()
        .scene
        .deleteAction(frame);

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