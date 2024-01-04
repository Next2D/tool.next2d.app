import { $TIMELINE_LAYER_ADD_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLayerAddMouseDownEventUseCase } from "./TimelineToolLayerAddMouseDownEventUseCase";

/**
 * @description レイヤー追加のイベント登録
 *              Register an event to add a layer
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_ADD_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolLayerAddMouseDownEventUseCase
    );
};