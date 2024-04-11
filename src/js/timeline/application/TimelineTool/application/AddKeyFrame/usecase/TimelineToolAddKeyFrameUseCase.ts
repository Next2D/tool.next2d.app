import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 選択中のレイヤーにキーフレームを追加
 *              Add a keyframe to the selected layer
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // キーフレームを追加
    if (movieClip.selectedStartFrame) {
        // 選択中のフレームがある場合、そのフレームに追加
        externalTimeline
            .convertToKeyframes(
                movieClip.selectedStartFrame,
                movieClip.selectedEndFrame
            );
    } else {
        // 選択中のフレームがない場合、マーカーのあるフレームに追加
        externalTimeline
            .convertToKeyframes(
                movieClip.currentFrame
            );
    }
};