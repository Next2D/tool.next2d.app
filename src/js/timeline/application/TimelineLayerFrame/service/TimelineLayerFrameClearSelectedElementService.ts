import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description 選択中のフレームElementを非アクティブに更新してマップデータを初期化
 *              Update selected frame Element to inactive and initialize map data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const leftFrame = $getLeftFrame();
    for (const [layerId, frames] of timelineLayer.targetLayers) {

        const element: HTMLElement | null = document
            .getElementById(`timeline-frame-controller-${layerId}`);

        if (!element) {
            continue;
        }

        const children = element.children;
        for (let idx: number = 0; idx < frames.length; ++idx) {
            const index = frames[idx] - leftFrame;

            const node: HTMLElement | undefined = children[index] as HTMLElement;
            if (!node) {
                continue;
            }

            node.classList.remove("frame-active");
        }
    }
};