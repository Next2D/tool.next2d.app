import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 選択中のレイヤーのフレームを削除
 *              Delete the frames of the selected layer
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
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
    externalTimeline
        .eraseFrames(
            movieClip.selectedStartFrame,
            movieClip.selectedEndFrame
        );
};