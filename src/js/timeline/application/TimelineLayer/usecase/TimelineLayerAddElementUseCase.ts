import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Layer } from "@/core/domain/model/Layer";
import { $getLeftFrame, $getTopIndex } from "../../TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";
import { execute as timelineLayerCreateUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerCreateUseCase";
import { execute as timelineLayerFrameCreateContentComponentService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameCreateContentComponentService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";

/**
 * @description ターゲットレイヤーの上位に指定のレイヤーを追加
 *              Add the specified layer above the target layer
 *
 * @param   {Layer} add_layer
 * @param   {Layer} target_layer
 * @returns {void}
 * @method
 * @public
 */
export const execute = (add_layer: Layer, target_layer: Layer): void =>
{
    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const targetLayerElement: HTMLElement | null = document
        .getElementById(`layer-id-${target_layer.id}`);

    if (!targetLayerElement) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    const frameWidth: number   = workSpace.timelineAreaState.frameWidth;
    const elementCount: number = Math.ceil(timelineHeader.clientWidth / (frameWidth + 1));
    const maxFrame: number     = elementCount + 1;
    const leftFrame: number    = $getLeftFrame();

    let element: HTMLElement | null = null;
    let frameControllerElement: HTMLElement | null = null;
    if (add_layer.id >= timelineLayer.elements.length) {

        // 新規レイヤーを追加
        timelineLayerCreateUseCase(
            parent, add_layer.id, maxFrame, leftFrame
        );

        // フレーム側のElementをを変数にセット
        element = parent.lastElementChild as HTMLElement;
        frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        // 指定レイヤーの上位に移動
        parent.insertBefore(element, targetLayerElement);

    } else {

        // フレーム側のElementをを変数にセット
        element = timelineLayer.elements[add_layer.id];
        frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

        // 表示フレーム数が多い時はElementを追加
        const length: number = frameControllerElement.children.length;
        if (maxFrame > length) {
            // 不足しているフレームを追加
            timelineLayerFrameCreateContentComponentService(
                frameControllerElement, length, maxFrame, add_layer.id, leftFrame
            );
        }

        // 指定レイヤーの上位に移動
        parent.insertBefore(element, targetLayerElement);
    }

    // 表示領域にあれば表示、表示領域外なら非表示
    const index = workSpace.scene.layers.indexOf(add_layer);
    if ($getTopIndex() > index
        || (index + 1) * workSpace.timelineAreaState.frameHeight > timelineLayer.clientHeight
    ) {
        if (add_layer.display === "") {
            add_layer.display = element.style.display = "none";
        }
    } else {
        if (add_layer.display === "none") {
            add_layer.display = element.style.display = "";
        }
    }

    // スクロール位置に合わせてフレームElementのStyleを更新
    timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

    // Layerの状態に合わせてstyle, classの状態を更新
    timelineLayerControllerUpdateElementStyleUseCase(add_layer);
};