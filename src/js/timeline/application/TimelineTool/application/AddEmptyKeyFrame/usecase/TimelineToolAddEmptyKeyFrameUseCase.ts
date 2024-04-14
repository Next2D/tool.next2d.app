import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 空のキーフレームを追加する
 *              Add an empty key frame
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // キーフレームを追加
    if (movieClip.selectedStartFrame) {
        // 選択中のフレームがある場合、そのフレームに追加
        await externalTimeline
            .convertToEmptyKeyframes(
                movieClip.selectedStartFrame,
                movieClip.selectedEndFrame
            );
    } else {
        // 選択中のフレームがない場合、マーカーのあるフレームに追加
        await externalTimeline
            .convertToEmptyKeyframes(
                movieClip.currentFrame
            );
    }
};