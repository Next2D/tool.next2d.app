import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";
import { execute as timelineLayerFrameCreateContentComponentService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameCreateContentComponentService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerCreateUseCase } from "./TimelineLayerCreateUseCase";
import { execute as timelineLayerAllElementDisplayNoneService } from "../service/TimelineLayerAllElementDisplayNoneService";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
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

    // 再描画前に全てのレイヤーelementを非表示にする
    timelineLayerAllElementDisplayNoneService();

    // フレームElementの表示を初期化
    timelineLayerAllClearSelectedElementService();

    const frameHeight: number = workSpace.timelineAreaState.frameHeight;
    const frameWidth: number  = workSpace.timelineAreaState.frameWidth + 1;
    const maxFrame: number    = Math.ceil(timelineHeader.clientWidth / frameWidth) + 1;
    const leftFrame: number   = $getLeftFrame();

    const targetLayers = timelineLayer.targetLayers;
    let currentHeight: number = 0;
    let index: number = 0;
    for (let idx = $getTopIndex(); layers.length > idx; ++idx) {

        const layer = layers[idx];

        let element: HTMLElement | null = null;
        let frameControllerElement: HTMLElement | null = null;

        // 配列にElementがあれば再利用
        if (timelineLayer.elements.length > index) {

            // フレーム側のElementをを変数にセット
            element = timelineLayer.elements[index] as NonNullable<HTMLElement>;
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

            // 表示フレーム足りない時はフレームのlementを追加
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
        element.style.display = "";

        // スクロール位置に合わせてフレームElementのStyleを更新
        timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

        // Layerオブジェクトの状態に合わせて、表示Elementの情報を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);

        if (targetLayers.size && targetLayers.has(layer.id)) {
            timelineLayerActiveElementService(element);
        }

        // フレームの高さを加算
        currentHeight += frameHeight;

        // 表示領域外になったら非表示設定にしてスキップ
        if (currentHeight > timelineLayer.clientHeight) {
            break;
        }

        index++;
    }

    timelineLayer.numberOfDisplays = index;
};