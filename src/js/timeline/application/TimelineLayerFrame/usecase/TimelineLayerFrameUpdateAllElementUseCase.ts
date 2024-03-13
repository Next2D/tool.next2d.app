import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame, $getTopIndex } from "../../TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerFrameCreateContentComponentService } from "../service/TimelineLayerFrameCreateContentComponentService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description 表示領域にある全てのフレームElementを再描画
 *              Redraw all frame Elements in the display area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    const layers = scene.layers;
    if (!layers.length) {
        return ;
    }

    const frameWidth: number  = workSpace.timelineAreaState.frameWidth + 1;
    const frameHeight: number = workSpace.timelineAreaState.frameHeight;
    const leftFrame: number   = $getLeftFrame();
    const maxFrame: number    = Math.ceil(timelineHeader.clientWidth / frameWidth) + 1;

    let currentHeight: number = 0;
    for (let idx = $getTopIndex(); layers.length > idx; ++idx) {

        const layer = layers[idx];

        const index = layer.getDisplayIndex();
        const element: HTMLElement | undefined = timelineLayer.elements[index];
        if (!element) {
            continue;
        }

        const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        // 表示フレーム足りない時はフレームのlementを追加
        const length: number = frameControllerElement.children.length;
        if (maxFrame > length) {
            // 不足しているフレームを追加
            timelineLayerFrameCreateContentComponentService(
                frameControllerElement, length, maxFrame, index, leftFrame
            );
        }

        // スクロール位置に合わせてフレームElementのStyleを更新
        timelineLayerFrameUpdateStyleService(scene, frameControllerElement, leftFrame);

        // フレームの高さを加算
        currentHeight += frameHeight;

        // 下部に隠れていれば処理を終了
        if (currentHeight > timelineLayer.clientHeight) {
            break;
        }
    }
};