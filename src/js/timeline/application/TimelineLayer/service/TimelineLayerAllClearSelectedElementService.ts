import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description 全てのレイヤーElementのアクティブ情報をリセット
 *              Reset active information for all Layer Elements
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const frames = timelineLayer
        .targetLayers
        .values()
        .next()
        .value;

    const leftFrame = $getLeftFrame();
    const length: number = timelineLayer.elements.length;
    for (let idx: number = 0; length > idx; ++idx) {

        const layerElement = timelineLayer.elements[idx];

        // 非アクティブならスキップ
        if (!layerElement.classList.contains("active")) {
            continue;
        }

        // レイヤーのアクティブ表示を初期化
        layerElement.classList.remove("active");

        const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;

        const children = frameElement.children;
        for (let idx: number = 0; idx < frames.length; ++idx) {

            const frameIndex = frames[idx] - leftFrame;

            const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
            if (!element) {
                continue;
            }

            // フレームのアクティブ表示を初期化
            element.classList.remove("frame-active");
        }
    }
};