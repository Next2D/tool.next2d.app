import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateScriptElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateScriptElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import {
    $getLeftFrame,
    $getRightFrame
} from "@/timeline/application/TimelineUtil";

/**
 * @description 変更前のスクリプトに上書きする
 *              Overwrite the script before modification
 *
 * @param  {number} frame
 * @param  {string} before_script
 * @return {void}
 * @method
 * @public
 */
export const execute = (frame: number, before_script: string): void =>
{
    // スクリプトを上書き
    $getCurrentWorkSpace()
        .scene
        .setAction(frame, before_script);

    // 表示領域にあればアイコンを更新
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