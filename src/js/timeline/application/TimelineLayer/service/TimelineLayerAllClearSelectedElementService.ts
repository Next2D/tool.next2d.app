import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    const scene = $getCurrentWorkSpace().scene;

    const leftFrame = $getLeftFrame();
    for (let idx = 0; scene.selectedLayers.length > idx; ++idx) {

        const layer = scene.selectedLayers[idx];

        const layerElement: HTMLElement | null = layer.element;
        if (!layerElement) {
            continue;
        }

        // レイヤーのアクティブ表示を初期化
        layerElement.classList.remove("active");

        // 選択したHTMLElementをnullに更新
        layer.element = null;

        const startFrame = layer.selectedFrame.start;
        const endFrame   = layer.selectedFrame.end;

        // フレーム側のElementを更新
        const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
        const children = frameElement.children;
        for (let frame: number = startFrame; endFrame >= frame; ++frame) {

            const frameIndex = frame - leftFrame;

            const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
            if (!element) {
                continue;
            }

            // フレームのアクティブ表示を初期化
            element.classList.remove("frame-active");
        }
    }
};