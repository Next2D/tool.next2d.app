import { execute as scriptEditorModalShowService } from "../service/ScriptEditorModalShowService";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setTargetFrame, $setTargetMovieClip } from "../ScriptEditorModalUtil";

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
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    const scene = $getCurrentWorkSpace().scene;
    $setTargetMovieClip(scene);
    $setTargetFrame(scene.currentFrame);

    // スクリプトエディタを起動
    scriptEditorModalShowService();
};