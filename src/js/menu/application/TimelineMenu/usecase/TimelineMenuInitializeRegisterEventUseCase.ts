import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMenuAddKeyframeMouseDownUseCase } from "./TimelineMenuAddKeyframeMouseDownUseCase";
import { execute as timelineMenuAddEmptyKeyframeMouseDownUseCase } from "./TimelineMenuAddEmptyKeyframeMouseDownUseCase";
import { execute as timelineMenuAddFramesMouseDownUseCase } from "./TimelineMenuAddFramesMouseDownUseCase";
import { execute as timelineMenuAddScriptMouseDownUseCase } from "./TimelineMenuAddScriptMouseDownUseCase";
import { execute as timelineMenuEraseFramesMouseDownUseCase } from "./TimelineMenuEraseFramesMouseDownUseCase";
import { execute as timelineMenuDeleteKeyframeMouseDownUseCase } from "./TimelineMenuDeleteKeyframeMouseDownUseCase";
import { execute as timelineMenuMoveLastFrameMouseDownUseCase } from "./TimelineMenuMoveLastFrameMouseDownUseCase";
import { execute as timelineMenuMoveFirstFrameMouseDownUseCase } from "./TimelineMenuMoveFirstFrameMouseDownUseCase";
import {
    $TIMELINE_MENU_ADD_EMPTY_KEYFRAME_ID,
    $TIMELINE_MENU_ADD_SCRIPT_ID,
    $TIMELINE_MENU_ADD_KEYFRAME_ID,
    $TIMELINE_MENU_ADD_FRAMES_ID,
    $TIMELINE_MENU_ERASE_FRAMES_ID,
    $TIMELINE_MENU_DELETE_KEYFRAME_ID,
    $TIMELINE_MENU_LAST_FRAME_ID,
    $TIMELINE_MENU_FIRST_FRAME_ID
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

    // キーフレームの削除
    const deleteKeyFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_DELETE_KEYFRAME_ID);

    if (deleteKeyFrameElement) {
        deleteKeyFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuDeleteKeyframeMouseDownUseCase
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
    const eraseFramesElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_ERASE_FRAMES_ID);

    if (eraseFramesElement) {
        eraseFramesElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuEraseFramesMouseDownUseCase
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

    // 最初のフレームへの移動ボタン
    const firstFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_FIRST_FRAME_ID);

    if (firstFrameElement) {
        firstFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuMoveFirstFrameMouseDownUseCase
        );
    }

    // 最後のフレームへの移動ボタン
    const lastFrameElement: HTMLElement | null = document
        .getElementById($TIMELINE_MENU_LAST_FRAME_ID);

    if (lastFrameElement) {
        lastFrameElement.addEventListener(EventType.MOUSE_DOWN,
            timelineMenuMoveLastFrameMouseDownUseCase
        );
    }
};