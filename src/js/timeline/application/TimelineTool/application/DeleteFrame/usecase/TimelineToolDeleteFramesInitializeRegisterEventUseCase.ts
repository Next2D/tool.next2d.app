import { $TIMELINE_DELETE_FRAME_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolDeleteFramesMouseDownEventUseCase } from "./TimelineToolDeleteFramesMouseDownEventUseCase";

/**
 * @description フレーム削除ボタンのイベント登録
 *              Event registration of frame deletion button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_DELETE_FRAME_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolDeleteFramesMouseDownEventUseCase
    );
};