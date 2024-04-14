import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 選択中のレイヤーにフレームを追加
 *              Add frames to the selected layer
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

    // フレームを追加
    await externalTimeline
        .insertFrames(movieClip.selectedEndFrame - movieClip.selectedStartFrame);
};