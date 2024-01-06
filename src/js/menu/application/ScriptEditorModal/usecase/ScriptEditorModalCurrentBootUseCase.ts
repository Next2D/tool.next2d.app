import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setTargetFrame, $setTargetMovieClip } from "../ScriptEditorModalUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { execute as scriptEditorModalShowService } from "../service/ScriptEditorModalShowService";

/**
 * @description 現在のMovieClipとフレームを指定してスクリプトエディタを起動
 *              Start the Script Editor with the current MovieClip and frame
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    $setTargetMovieClip($getCurrentWorkSpace().scene);
    $setTargetFrame(timelineFrame.currentFrame);

    // スクリプトエディタを起動
    scriptEditorModalShowService();
};