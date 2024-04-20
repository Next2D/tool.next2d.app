import { $TIMELINE_LABEL_NAME } from "@/config/TimelineConfig";
import { execute as timelineToolLabelFocusInEventService } from "../service/TimelineToolLabelFocusInEventService";
import { execute as timelineToolLabelFocusOutEventUseCase } from "./TimelineToolLabelFocusOutEventUseCase";
import { execute as timelineToolLabelKeyPressEventService } from "../service/TimelineToolLabelKeyPressEventService";

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
        timelineToolLabelFocusInEventService
    );
    element.addEventListener("focusout",
        timelineToolLabelFocusOutEventUseCase
    );
    element.addEventListener("keypress",
        timelineToolLabelKeyPressEventService
    );
};