import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 選択中のレイヤーのキーフレームを削除
 *              Delete the keyframes of the selected layer
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択がない場合は処理を終了
    if (!movieClip.selectedStartFrame) {
        return ;
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // キーフレームを追加
    await externalTimeline
        .deleteKeyframes(
            movieClip.selectedStartFrame,
            movieClip.selectedEndFrame
        );
};