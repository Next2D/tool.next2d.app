import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $getLeftFrame,
    timelineHeader,
    timelineLayer
} from "../../TimelineUtil";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";
import { execute as timelineLayerFrameCreateContentComponentService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameCreateContentComponentService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerCreateUseCase } from "./TimelineLayerCreateUseCase";

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
    if (!layers.size) {
        return ;
    }

    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const frameWidth: number   = workSpace.timelineAreaState.frameWidth;
    const elementCount: number = Math.ceil(timelineHeader.clientWidth / (frameWidth + 1));
    const maxFrame: number     = elementCount + 1;
    const leftFrame: number    = $getLeftFrame();
    for (const [layerId, layer] of layers) {

        let frameControllerElement: HTMLElement | null = null;
        if (layerId >= timelineLayer.elements.length) {

            // 新規レイヤーを追加
            timelineLayerCreateUseCase(
                parent, layerId, maxFrame, leftFrame
            );

            // フレーム側のElementをを変数にセット
            const element = parent.lastElementChild as HTMLElement;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        } else {

            // フレーム側のElementをを変数にセット
            const element = timelineLayer.elements[layerId] as NonNullable<HTMLElement>;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

            // 表示フレーム数が多い時はElementを追加
            const length: number = frameControllerElement.children.length;
            if (maxFrame > length) {
                // 不足しているフレームを追加
                timelineLayerFrameCreateContentComponentService(
                    frameControllerElement, length, maxFrame, layerId, leftFrame
                );
            }

            // 表示
            element.style.display = "";
        }

        if (!frameControllerElement) {
            continue;
        }

        // スクロール位置に合わせてフレームElementのStyleを更新
        timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

        // Layerの状態に合わせてstyle, classの状態を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);
    }
};