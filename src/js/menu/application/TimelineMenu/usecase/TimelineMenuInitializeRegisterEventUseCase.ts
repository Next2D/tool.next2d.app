import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMenuAddEmptyKeyframeMouseDownUseCase } from "./TimelineMenuAddEmptyKeyframeMouseDownUseCase";
import { execute as timelineMenuAddScriptMouseDownUseCase } from "./TimelineMenuAddScriptMouseDownUseCase";
import {
    $TIMELINE_MENU_ADD_EMPTY_KEYFRAME_ID,
    $TIMELINE_MENU_ADD_SCRIPT_ID
} from "@/config/TimelineMenuConfig";

/**
 * @description タイムラインメニューのイベント登録関数
 *              Timeline menu event registration function
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const addEmptyKeyFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_EMPTY_KEYFRAME_ID);

    if (addEmptyKeyFrameElement) {
        addEmptyKeyFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddEmptyKeyframeMouseDownUseCase
        );
    }

    const addScriptElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_SCRIPT_ID);
    if (addScriptElement) {
        addScriptElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddScriptMouseDownUseCase
        );
    }
};