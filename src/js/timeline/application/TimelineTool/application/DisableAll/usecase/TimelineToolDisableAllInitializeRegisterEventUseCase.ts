import { $TIMELINE_LAYER_DISABLE_ALL_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLightAllUseCase } from "./TimelineToolDisableAllUseCase";

/**
 * @description レイヤーの全体の表示On/Offツールのイベント登録
 *              Registration of events for the Layer Whole View On/Off tool
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_DISABLE_ALL_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolLightAllUseCase
    );
};