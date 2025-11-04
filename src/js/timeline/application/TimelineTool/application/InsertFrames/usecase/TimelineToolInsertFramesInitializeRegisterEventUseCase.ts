import { $TIMELINE_INSERT_FRAME_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolInsertFramesPointerDownEventUseCase } from "./TimelineToolInsertFramesPointerDownEventUseCase";

/**
 * @description フレーム追加ボタンのイベント登録
 *              Event registration of add frame button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_INSERT_FRAME_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        timelineToolInsertFramesPointerDownEventUseCase
    );
};