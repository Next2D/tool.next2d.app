import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 空のキーフレームを追加する
 *              Add an empty key frame
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
    externalTimeline
        .convertToEmptyKeyframes(
            movieClip.currentFrame
        );
};