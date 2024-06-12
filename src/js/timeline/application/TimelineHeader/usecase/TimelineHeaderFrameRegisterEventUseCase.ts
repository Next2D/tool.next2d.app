import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderMouseDownEventUseCase } from "./TimelineHeaderMouseDownEventUseCase";
import { execute as timelineHeaderScriptIconMouseDownEventUseCase } from "./TimelineHeaderScriptIconMouseDownEventUseCase";
import { execute as timelineHeaderSoundIconMouseDownEventUseCase } from "./TimelineHeaderSoundIconMouseDownEventUseCase";
import { execute as timelineHeaderLabelIconMouseDownEventUseCase } from "./TimelineHeaderLabelIconMouseDownEventUseCase";
import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX
} from "@/config/TimelineConfig";

/**
 * @description タイムラインのヘッダーフレームにイベント登録を行う
 *              Register events in the header frame of the timeline
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // マウスダウンイベント
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineHeaderMouseDownEventUseCase
    );

    // スクリプトアイコン
    const scriptElement = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
    if (scriptElement) {
        scriptElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderScriptIconMouseDownEventUseCase
        );
    }

    // ラベルアイコン
    const labelElement = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
    if (labelElement) {
        labelElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderLabelIconMouseDownEventUseCase
        );
    }

    // サウンドアイコン
    const soundElement = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
    if (soundElement) {
        soundElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderSoundIconMouseDownEventUseCase
        );
    }
};