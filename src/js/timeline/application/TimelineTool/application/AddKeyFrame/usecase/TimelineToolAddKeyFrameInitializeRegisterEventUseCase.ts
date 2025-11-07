import { $TIMELINE_KEY_ADD_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolAddKeyFramePointerDownEventUseCase } from "./TimelineToolAddKeyFramePointerDownEventUseCase";

/**
 * @description キーフレーム追加ボタンのイベント登録
 *              Event registration of add keyframe button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_KEY_ADD_ID);

    if (!element) {
        return ;
    }

    // ポインターダウンイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        timelineToolAddKeyFramePointerDownEventUseCase
    );
};