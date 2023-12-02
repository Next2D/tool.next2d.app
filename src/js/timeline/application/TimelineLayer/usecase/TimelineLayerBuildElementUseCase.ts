import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type{ WorkSpace } from "@/core/domain/model/WorkSpace";
import {
    $getLeftFrame,
    $getTimelineFrameWidth,
    timelineHeader,
    timelineLayer
} from "../../TimelineUtil";
import { execute as layerContentControllerComponent } from "../component/LayerContentControllerComponent";
import { execute as layerContentFrameComponent } from "../component/LayerContentFrameComponent";
import { execute as timelineLayerMouseDownEventUseCase } from "./TimelineLayerMouseDownEventUseCase";
import { execute as timelineLayerControllerRegisterEventUseCase } from "./TimelineLayerControllerRegisterEventUseCase";
import { execute as timelineLayerFrameRegisterEventUseCase } from "./TimelineLayerFrameRegisterEventUseCase";
import { execute as timelineLayerUpdateControllerElementStyleUseCase } from "./TimelineLayerUpdateControllerElementStyleUseCase";
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

    const frame: number = $getLeftFrame();

    const timelineFrameWidth: number = $getTimelineFrameWidth();
    const elementCount: number = Math.ceil(timelineHeader.clientWidth / (timelineFrameWidth + 1));
    const maxFrame: number = elementCount + 1;

    for (const [layerId, layer] of layers) {

        let element: HTMLElement | null = null;
        if (layerId >= timelineLayer.elements.length) {

            // レイヤーのElementを新規登録
            parent.insertAdjacentHTML("beforeend",
                layerContentControllerComponent(layerId));

            element = parent.lastElementChild as HTMLElement;

            element.addEventListener(EventType.MOUSE_DOWN, timelineLayerMouseDownEventUseCase);

            // レイヤーのコントローラーのイベント登録
            const layerControllerElement = element.children[0] as NonNullable<HTMLElement>;
            timelineLayerControllerRegisterEventUseCase(layerControllerElement);

            // レイヤーのフレーム側のイベントを登録
            const layerFrameElement = element.children[1] as NonNullable<HTMLElement>;
            timelineLayerFrameRegisterEventUseCase(layerFrameElement);

            const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
            for (let idx: number = 0; idx <= maxFrame; ++idx) {
                frameControllerElement.insertAdjacentHTML("beforeend",
                    layerContentFrameComponent(layerId, frame + idx));
            }

            timelineLayer.elements.push(element);

        } else {

            element = timelineLayer.elements[layerId] as NonNullable<HTMLElement>;

            const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
            const children: HTMLCollection = frameControllerElement.children;

            // 表示フレーム数が多い時はElementを追加
            if (maxFrame > children.length) {
                for (let idx: number = children.length; idx <= maxFrame; ++idx) {
                    frameControllerElement.insertAdjacentHTML("beforeend",
                        layerContentFrameComponent(layerId, frame + idx));
                }
            }

            // 表示
            element.style.display = "";
        }

        if (!element) {
            continue;
        }

        // Layerの状態に合わせてstyle, classの状態を更新
        timelineLayerUpdateControllerElementStyleUseCase(layer);
    }
};