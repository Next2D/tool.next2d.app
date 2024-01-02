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
    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    const layers = workSpace.scene.layers;
    if (!layers.length) {
        return ;
    }

    const frameHeight: number = workSpace.timelineAreaState.frameHeight;
    const frameWidth: number  = workSpace.timelineAreaState.frameWidth + 1;
    const maxFrame: number    = Math.ceil(timelineHeader.clientWidth / frameWidth) + 1;
    const leftFrame: number   = $getLeftFrame();
    const topIndex: number    = $getTopIndex();

    let currentHeight: number = 0;
    for (let idx = 0; layers.length > idx; ++idx) {

        const layer = layers[idx];

        // 表示領域外にあればスキップ
        if (topIndex > idx || currentHeight > timelineLayer.clientHeight) {
            layer.display = "none";
            continue;
        }

        if (idx >= topIndex) {
            currentHeight += frameHeight;
        }

        let element: HTMLElement | null = null;
        let frameControllerElement: HTMLElement | null = null;

        // 配列にElementがあれば再利用
        if (timelineLayer.elements.length > idx) {

            // フレーム側のElementをを変数にセット
            element = timelineLayer.elements[idx] as NonNullable<HTMLElement>;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

            // 表示フレーム足りない時はEフレームのlementを追加
            const length: number = frameControllerElement.children.length;
            if (maxFrame > length) {
                // 不足しているフレームを追加
                timelineLayerFrameCreateContentComponentService(
                    frameControllerElement, length, maxFrame, layer.id, leftFrame
                );
            }

        } else {

            // 新規レイヤーを追加
            timelineLayerCreateUseCase(
                parent, layer.id, maxFrame, leftFrame
            );

            // フレーム側のElementをを変数にセット
            element = parent.lastElementChild as HTMLElement;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        }

        // 表示をOnにする
        if (layer.display === "none") {
            layer.display = element.style.display = "";
        }

        // スクロール位置に合わせてフレームElementのStyleを更新
        timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

        // Layerオブジェクトの状態に合わせて、表示Elementの情報を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);
    }
};