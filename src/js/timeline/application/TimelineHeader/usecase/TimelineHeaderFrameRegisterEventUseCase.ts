import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderPointerDownEventUseCase } from "./TimelineHeaderPointerDownEventUseCase";
import { execute as timelineHeaderScriptIconPointerDownEventUseCase } from "./TimelineHeaderScriptIconPointerDownEventUseCase";
import { execute as timelineHeaderSoundIconPointerDownEventUseCase } from "./TimelineHeaderSoundIconPointerDownEventUseCase";
import { execute as timelineHeaderLabelIconPointerDownEventUseCase } from "./TimelineHeaderLabelIconPointerDownEventUseCase";
import { execute as timelineHeaderTouchPointerUpService } from "../service/TimelineHeaderTouchPointerUpService";
import { execute as timelineHeaderTouchPointerDownUseCase } from "./TimelineHeaderTouchPointerDownUseCase";
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
    // タッチデバイスのタッチイベント
    element.addEventListener(
        EventType.POINTER_DOWN,
        timelineHeaderTouchPointerDownUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineHeaderTouchPointerUpService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        timelineHeaderTouchPointerUpService,
        { "passive": false }
    );

    // マウスダウンイベント
    element.addEventListener(EventType.POINTER_DOWN,
        timelineHeaderPointerDownEventUseCase
    );

    // スクリプトアイコン
    const scriptElement = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
    if (scriptElement) {
        scriptElement.addEventListener(EventType.POINTER_DOWN,
            timelineHeaderScriptIconPointerDownEventUseCase
        );
    }

    // ラベルアイコン
    const labelElement = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
    if (labelElement) {
        labelElement.addEventListener(EventType.POINTER_DOWN,
            timelineHeaderLabelIconPointerDownEventUseCase
        );
    }

    // サウンドアイコン
    const soundElement = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
    if (soundElement) {
        soundElement.addEventListener(EventType.POINTER_DOWN,
            timelineHeaderSoundIconPointerDownEventUseCase
        );
    }
};