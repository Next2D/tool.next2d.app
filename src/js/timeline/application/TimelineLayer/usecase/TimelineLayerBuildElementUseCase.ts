import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";
import { execute as timelineLayerFrameCreateContentComponentService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameCreateContentComponentService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerCreateUseCase } from "./TimelineLayerCreateUseCase";
import {
    $getLeftFrame,
    $getTopIndex
} from "../../TimelineUtil";

/**
 * @description 指定のMoiveClipのLayerからタイムラインを生成
 *              Generate a timeline from the specified MoiveClip's Layer
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();

    const layers = workSpace.scene.layers;
    if (!layers.length) {
        return ;
    }

    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const frameHeight: number  = workSpace.timelineAreaState.frameHeight;
    const frameWidth: number   = workSpace.timelineAreaState.frameWidth + 1;
    const maxFrame: number     = Math.ceil(timelineHeader.clientWidth / frameWidth) + 1;
    const leftFrame: number    = $getLeftFrame();
    const topIndex: number     = $getTopIndex();

    let currentHeight: number = 0;
    for (let idx = 0; layers.length > idx; ++idx) {

        const layer = layers[idx];

        let element: HTMLElement | null = null;
        let frameControllerElement: HTMLElement | null = null;
        if (layer.id >= timelineLayer.elements.length) {

            // 新規レイヤーを追加
            timelineLayerCreateUseCase(
                parent, layer.id, maxFrame, leftFrame
            );

            // フレーム側のElementをを変数にセット
            element = parent.lastElementChild as HTMLElement;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        } else {

            // フレーム側のElementをを変数にセット
            element = timelineLayer.elements[layer.id] as NonNullable<HTMLElement>;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

            // 表示フレーム数が多い時はElementを追加
            const length: number = frameControllerElement.children.length;
            if (maxFrame > length) {
                // 不足しているフレームを追加
                timelineLayerFrameCreateContentComponentService(
                    frameControllerElement, length, maxFrame, layer.id, leftFrame
                );
            }
        }

        // 表示領域にあれば表示、表示領域外なら非表示
        if (topIndex > idx || currentHeight > timelineLayer.clientHeight) {
            if (layer.display === "") {
                layer.display = element.style.display = "none";
            }
        } else {
            if (layer.display === "none") {
                layer.display = element.style.display = "";
            }
        }

        // スクロール位置に合わせてフレームElementのStyleを更新
        timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

        // Layerの状態に合わせてstyle, classの状態を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);

        if (idx >= topIndex) {
            currentHeight += frameHeight;
        }
    }
};