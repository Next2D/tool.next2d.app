import { $TIMELINE_LABEL_NAME } from "@/config/TimelineConfig";
import { execute as timelineToolLabelInputFocusInEventService } from "../service/TimelineToolLabelInputFocusInEventService";
import { execute as timelineToolLabelInputFocusOutEventUseCase } from "./TimelineToolLabelInputFocusOutEventUseCase";
import { execute as timelineToolLabelInputKeyPressEventService } from "../service/TimelineToolLabelInputKeyPressEventService";

/**
 * @description ラベル名操作のイベント登録
 *              Register label name operation events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LABEL_NAME);

    if (!element) {
        return ;
    }

    // イベントを登録
    element.addEventListener("focusin",
        timelineToolLabelInputFocusInEventService
    );
    element.addEventListener("focusout",
        timelineToolLabelInputFocusOutEventUseCase
    );
    element.addEventListener("keypress",
        timelineToolLabelInputKeyPressEventService
    );
};