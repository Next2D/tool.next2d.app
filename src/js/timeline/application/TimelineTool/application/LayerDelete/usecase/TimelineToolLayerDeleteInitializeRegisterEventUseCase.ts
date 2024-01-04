import { $TIMELINE_LAYER_DELETE_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLayerDeleteMouseDownEventUseCase } from "./TimelineToolLayerDeleteMouseDownEventUseCase";

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
        .getElementById($TIMELINE_LAYER_DELETE_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolLayerDeleteMouseDownEventUseCase
    );
};