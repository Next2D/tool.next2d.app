import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description レイヤーとフレームの複数選択の実行関数
 *              Function to execute multiple selection of layers and frames
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    indexes: number[],
    frame: number
): void => {

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(work_space, movie_clip);
    externalTimeline.selectedLayers(indexes);

    // 最後に選択したフレームを設定
    movie_clip.selectedFrameObject.end = frame;

    // フレームの開始と終了を取得
    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    // 指定した範囲のフレームをセット
    const frames = Array.from({ "length": endFrame - startFrame }, (_, idx) => idx + startFrame);
    externalTimeline.selectedFrames(frames);
};