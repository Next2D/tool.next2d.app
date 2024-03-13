import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description フレームの複数選択の実行関数
 *              Execution function for multiple frame selections
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // フレームElementのキーがなければ終了
    const frame = element.dataset.frame;
    const layerIndex = element.dataset.layerIndex;
    if (!frame || !layerIndex) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 最初に選択したレイヤーのindex値を取得
    const layer = scene.selectedLayers[0];
    const firstIndex = scene.layers.indexOf(layer);

    // 選択したレイヤーと最初のレイヤーを比較
    const minIndex = Math.min(parseInt(layerIndex), firstIndex);
    const maxIndex = Math.max(parseInt(layerIndex), firstIndex);

    // 選択範囲のレイヤーindex値の配列を作成
    const indexes = [firstIndex];
    for (let index = minIndex; maxIndex >= index; ++index) {
        if (firstIndex === index) {
            continue;
        }
        indexes.push(index);
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, scene);
    externalTimeline.selectedLayers(indexes);

    // 最後に選択したフレームを更新
    scene.selectedFrameObject.end = parseInt(frame);

    const startFrame = scene.selectedStartFrame;
    const endFrame   = scene.selectedEndFrame;

    const frames = [];
    for (let frame = startFrame; frame < endFrame; ++frame) {
        frames.push(frame);
    }
    externalTimeline.selectedFrames(frames);
};