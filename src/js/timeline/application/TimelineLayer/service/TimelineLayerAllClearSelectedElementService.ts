import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 全てのレイヤーElementのアクティブ情報をリセット、内部情報はここで初期化はしない。
 *              Elementだけの初期化関数
 *              Reset active information of all layer elements, internal information is not initialized here.
 *              Element-only initialization functions
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

        const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            continue;
        }

        // レイヤーのアクティブ表示を初期化
        layerElement.classList.remove("active");

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