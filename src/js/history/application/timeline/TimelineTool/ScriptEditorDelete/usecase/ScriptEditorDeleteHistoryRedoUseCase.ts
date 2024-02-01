import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description スクリプトを削除する
 *              Delete Script
 *
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .deleteAction(frame);

    // 表示領域にあればアイコンを削除
    if ($getLeftFrame() <= frame
        && $getRightFrame() >= frame
    ) {
        const node = timelineHeader.elements[frame - $getLeftFrame()] as HTMLElement;
        if (!node) {
            return ;
        }

        // ヘッダーの表示を更新
        timelineHeaderUpdateScriptElementService(node, frame);
    }
};