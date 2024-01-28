import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setTargetFrame, $setTargetMovieClip } from "../ScriptEditorModalUtil";
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
    const scene = $getCurrentWorkSpace().scene;
    $setTargetMovieClip(scene);
    $setTargetFrame(scene.currentFrame);

    // スクリプトエディタを起動
    scriptEditorModalShowService();
};