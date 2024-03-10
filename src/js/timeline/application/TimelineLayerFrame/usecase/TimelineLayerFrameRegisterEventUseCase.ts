import { execute as timelineMenuShowService } from "@/menu/application/TimelineMenu/service/TimelineMenuShowService";
import { execute as timelineLayerFrameMouseDownEventUseCase } from "./TimelineLayerFrameMouseDownEventUseCase";
import { execute as timelineLayerFrameMouseUpEventUseCase } from "./TimelineLayerFrameMouseUpEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description レイヤーのフーレム部分のイベント登録処理
 *              Event registration process for the Houlem part of the layer
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 右クリックイベント登録
    element.addEventListener("contextmenu", timelineMenuShowService);

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineLayerFrameMouseDownEventUseCase
    );

    // マウスアップイベントを登録
    element.addEventListener(EventType.MOUSE_UP,
        timelineLayerFrameMouseUpEventUseCase
    );
};