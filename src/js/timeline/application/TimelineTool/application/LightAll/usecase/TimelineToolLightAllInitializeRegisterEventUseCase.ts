import { $TIMELINE_LAYER_LIGHT_ALL_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLightAllUseCase } from "./TimelineToolLightAllUseCase";

/**
 * @description レイヤーの削除ツールのイベント登録
 *              Delete Layer tool event registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_LIGHT_ALL_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolLightAllUseCase
    );
};