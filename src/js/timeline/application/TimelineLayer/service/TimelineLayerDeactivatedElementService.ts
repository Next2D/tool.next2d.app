import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description 指定レイヤーElementを非アクティブに更新
 *              Update specified Layer Element to inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // レイヤーのアクティブ表示を初期化
    layerElement.classList.remove("active");

    const startFrame = layer.selectedFrame.start;
    const endFrame   = layer.selectedFrame.end;

    // フレーム側のElementを更新
    const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
    const children = frameElement.children;
    for (let frame: number = startFrame; endFrame >= frame; ++frame) {

        const frameIndex = frame - $getLeftFrame();

        const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
        if (!element) {
            continue;
        }

        // フレームのアクティブ表示を初期化
        element.classList.remove("frame-active");
    }
};