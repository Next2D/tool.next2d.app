import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameClearSelectedUseCase } from "./TimelineLayerFrameClearSelectedUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description マウスでの複数フレーム選択処理関数
 *              Multiple frame selection processing function with mouse
 *
 * @param {PointerEvent} event
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // フレームElementのキーがなければ終了
        const frame = element.dataset.frame;
        const layerIndex = element.dataset.layerIndex;
        if (!frame || !layerIndex) {
            return ;
        }

        // 現在の表示を初期化
        timelineLayerFrameClearSelectedUseCase();

        // 最後に選択したフレームをセット
        timelineLayer.selectedFrameObject.end = parseInt(frame);

        const layer = timelineLayer.selectedLayers[0];
        const movieClip  = $getCurrentWorkSpace().scene;
        const firstIndex = movieClip.layers.indexOf(layer);

        const minLayerIndex = Math.min(firstIndex, parseInt(layerIndex));
        const maxLayerIndex = Math.max(firstIndex, parseInt(layerIndex));

        const startFrame = Math.min(
            timelineLayer.selectedFrameObject.start,
            timelineLayer.selectedFrameObject.end
        );

        const endFrame = Math.max(
            timelineLayer.selectedFrameObject.start,
            timelineLayer.selectedFrameObject.end
        );

        // 内部情報を初期化
        timelineLayer.selectedLayers.length = 0;

        // 選択範囲を更新
        timelineLayer.selectedLayers.push(layer);

        const leftFrame = $getLeftFrame();
        for (let idx = minLayerIndex; maxLayerIndex >= idx; ++idx) {

            const layer = movieClip.layers[idx];

            // フレームの選択範囲をセット
            layer.selectedFrame.start = startFrame;
            layer.selectedFrame.end   = endFrame + 1;

            // 内部情報に追加
            if (timelineLayer.selectedLayers.indexOf(layer) === -1) {
                timelineLayer.selectedLayers.push(layer);
            }

            const layerElement = timelineLayer.elements[layer.getDisplayIndex()];
            if (!layerElement) {
                continue;
            }

            // フレーム側のElementを更新
            const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;

            const children = frameElement.children;
            const length   = children.length;
            for (let frame: number = startFrame; endFrame >= frame; ++frame) {

                const frameIndex = frame - leftFrame;
                if (frameIndex > length) {
                    continue;
                }

                const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
                if (!element) {
                    continue;
                }

                element.classList.add("frame-active");
            }
        }
    });
};