import { EventType } from "@/tool/domain/event/EventType";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerComponent } from "../../TimelineLayerController/component/TimelineLayerControllerComponent";
import { execute as timelineLayerMouseDownEventService } from "./TimelineLayerMouseDownEventUseCase";
import { execute as timelineLayerControllerRegisterEventUseCase } from "../../TimelineLayerController/usecase/TimelineLayerControllerRegisterEventUseCase";
import { execute as timelineLayerFrameRegisterEventUseCase } from "../../TimelineLayerFrame/usecase/TimelineLayerFrameRegisterEventUseCase";
import { execute as timelineLayerFrameCreateContentComponentService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameCreateContentComponentService";

/**
 * @description 指定のElementに新規のレイヤーを追加
 *              Add a new layer to the specified Element
 *
 * @param  {HTMLElement} parent
 * @param  {number} layer_id
 * @param  {number} max_frame
 * @param  {number} left_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    parent: HTMLElement,
    layer_id: number,
    max_frame: number,
    left_frame: number
): void => {

    const layerIndex = timelineLayer.elements.length;

    // レイヤーのElementを新規登録
    parent.insertAdjacentHTML("beforeend",
        timelineLayerControllerComponent(layerIndex, layer_id)
    );

    const element = parent.lastElementChild as NonNullable<HTMLElement>;
    timelineLayer.elements.push(element);

    // レイヤー全体のマウスダウンイベント
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineLayerMouseDownEventService
    );

    // レイヤーのコントローラーのイベント登録
    const layerControllerElement = element.firstElementChild as NonNullable<HTMLElement>;
    timelineLayerControllerRegisterEventUseCase(
        layerControllerElement
    );

    // レイヤーのフレーム側のイベントを登録
    const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
    timelineLayerFrameRegisterEventUseCase(
        frameControllerElement
    );

    // フレームのElementを追加
    timelineLayerFrameCreateContentComponentService(
        frameControllerElement, 0, max_frame, layerIndex, left_frame
    );
};