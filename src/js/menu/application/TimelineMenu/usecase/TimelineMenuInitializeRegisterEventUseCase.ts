import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMenuAddKeyframeMouseDownUseCase } from "./TimelineMenuAddKeyframeMouseDownUseCase";
import { execute as timelineMenuAddEmptyKeyframeMouseDownUseCase } from "./TimelineMenuAddEmptyKeyframeMouseDownUseCase";
import { execute as timelineMenuAddFramesMouseDownUseCase } from "./TimelineMenuAddFramesMouseDownUseCase";
import { execute as timelineMenuAddScriptMouseDownUseCase } from "./TimelineMenuAddScriptMouseDownUseCase";
import { execute as timelineMenuDeleteFramesMouseDownUseCase } from "./TimelineMenuDeleteFramesMouseDownUseCase";
import {
    $TIMELINE_MENU_ADD_EMPTY_KEYFRAME_ID,
    $TIMELINE_MENU_ADD_SCRIPT_ID,
    $TIMELINE_MENU_ADD_KEYFRAME_ID,
    $TIMELINE_MENU_ADD_FRAMES_ID,
    $TIMELINE_MENU_DELETE_FRAMES_ID
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
    // キーフレームの追加
    const addKeyFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_KEYFRAME_ID);

    if (addKeyFrameElement) {
        addKeyFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddKeyframeMouseDownUseCase
        );
    }

    // 空のキーフレームの追加
    const addEmptyKeyFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_EMPTY_KEYFRAME_ID);

    if (addEmptyKeyFrameElement) {
        addEmptyKeyFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddEmptyKeyframeMouseDownUseCase
        );
    }

    // フレームの追加
    const addFramesElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_FRAMES_ID);

    if (addFramesElement) {
        addFramesElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddFramesMouseDownUseCase
        );
    }

    // フレームの削除
    const deleteFramesElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_DELETE_FRAMES_ID);

    if (deleteFramesElement) {
        deleteFramesElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuDeleteFramesMouseDownUseCase
        );
    }

    // スクリプトの追加
    const addScriptElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ADD_SCRIPT_ID);

    if (addScriptElement) {
        addScriptElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuAddScriptMouseDownUseCase
        );
    }
};