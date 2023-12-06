import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type{ WorkSpace } from "@/core/domain/model/WorkSpace";
import {
    $getLeftFrame,
    timelineHeader,
    timelineLayer,
    timelineFrame
} from "../../TimelineUtil";
import { execute as timelineLayerControllerComponent } from "../../TimelineLayerController/component/TimelineLayerControllerComponent";
import { execute as timelineLayerFrameContentComponent } from "../../TimelineLayerFrame/component/TimelineLayerFrameContentComponent";
import { execute as timelineLayerMouseDownEventUseCase } from "./TimelineLayerMouseDownEventUseCase";
import { execute as timelineLayerControllerRegisterEventUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerRegisterEventUseCase";
import { execute as timelineLayerFrameRegisterEventUseCase } from "../../TimelineLayerFrame/usecase/TimelineLayerFrameRegisterEventUseCase";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";
import { EventType } from "@/tool/domain/event/EventType";

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
    const workSpace: WorkSpace = $getCurrentWorkSpace();
    if (!workSpace) {
        return ;
    }

    const layers = workSpace.scene.layers;
    if (!layers.size) {
        return ;
    }

    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const elementCount: number = Math.ceil(timelineHeader.clientWidth / (timelineFrame.width + 1));
    const maxFrame: number     = elementCount + 1;
    const leftFrame: number    = $getLeftFrame();
    for (const [layerId, layer] of layers) {

        let frameControllerElement: HTMLElement | null = null;
        if (layerId >= timelineLayer.elements.length) {

            // レイヤーのElementを新規登録
            parent.insertAdjacentHTML("beforeend",
                timelineLayerControllerComponent(layerId)
            );

            const element = parent.lastElementChild as HTMLElement;

            // レイヤー全体のマウスダウンイベント
            element.addEventListener(EventType.MOUSE_DOWN,
                timelineLayerMouseDownEventUseCase
            );

            // レイヤーのコントローラーのイベント登録
            const layerControllerElement = element.firstElementChild as NonNullable<HTMLElement>;
            timelineLayerControllerRegisterEventUseCase(
                layerControllerElement
            );

            // レイヤーのフレーム側のイベントを登録
            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
            timelineLayerFrameRegisterEventUseCase(
                frameControllerElement
            );

            for (let idx: number = 0; idx <= maxFrame; ++idx) {
                frameControllerElement.insertAdjacentHTML("beforeend",
                    timelineLayerFrameContentComponent(layerId, leftFrame + idx)
                );
            }

            timelineLayer.elements.push(element);

        } else {

            const element = timelineLayer.elements[layerId] as NonNullable<HTMLElement>;

            frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;

            // 表示フレーム数が多い時はElementを追加
            const length: number = frameControllerElement.children.length;
            if (maxFrame > length) {
                for (let idx: number = length; idx <= maxFrame; ++idx) {
                    frameControllerElement.insertAdjacentHTML("beforeend",
                        timelineLayerFrameContentComponent(layerId, leftFrame + idx)
                    );
                }
            }

            // 表示
            element.style.display = "";
        }

        if (!frameControllerElement) {
            continue;
        }

        const children: HTMLCollection = frameControllerElement.children;
        const length: number = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const node: HTMLElement | undefined = children[idx] as HTMLElement;
            if (!node) {
                continue;
            }

            const frame = leftFrame + idx;
            node.setAttribute("data-frame", `${frame}`);
            node.setAttribute("data-frame-state", "empty");
            node.setAttribute("class", frame % 5 !== 0
                ? "frame"
                : "frame frame-pointer"
            );
        }

        // Layerの状態に合わせてstyle, classの状態を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);
    }
};