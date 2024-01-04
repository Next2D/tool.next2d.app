import { $TIMELINE_LAYER_SCRIPT_ADD_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolScriptEditorMouseDownEventUseCase } from "./TimelineToolScriptEditorMouseDownEventUseCase";

/**
 * @description スクリプトエディタの起動ボタンのイベント登録
 *              Script Editor Launch Button Event Registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_SCRIPT_ADD_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolScriptEditorMouseDownEventUseCase
    );
};