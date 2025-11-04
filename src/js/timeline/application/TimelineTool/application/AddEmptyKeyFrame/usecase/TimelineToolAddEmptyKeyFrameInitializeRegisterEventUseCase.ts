import { $TIMELINE_EMPTY_KEY_ADD_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolAddEmptyKeyFramePointerDownEventUseCase } from "./TimelineToolAddEmptyKeyFramePointerDownEventUseCase";

/**
 * @description 空のキーフレーム追加ボタンのイベント登録
 *              Event registration for add empty keyframe button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_EMPTY_KEY_ADD_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        timelineToolAddEmptyKeyFramePointerDownEventUseCase
    );
};