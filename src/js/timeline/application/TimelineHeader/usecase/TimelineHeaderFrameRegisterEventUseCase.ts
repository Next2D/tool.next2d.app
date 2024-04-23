import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderMouseDownEventUseCase } from "./TimelineHeaderMouseDownEventUseCase";
import { execute as timelineHeaderScriptIconMouseDownEventService } from "../service/TimelineHeaderScriptIconMouseDownEventService";
import { execute as timelineHeaderLabelIconMouseDownEventService } from "../service/TimelineHeaderLabelIconMouseDownEventService";
import { execute as timelineHeaderSoundIconMouseDownEventService } from "../service/TimelineHeaderSoundIconMouseDownEventService";
import { execute as timelineHeaderIconDragEndEventService } from "../service/TimelineHeaderIconDragEndEventService";
import { execute as timelineHeaderIconDragOverService } from "../service/TimelineHeaderIconDragOverService";
import { execute as timelineHeaderIconDragEnterService } from "../service/TimelineHeaderIconDragEnterService";
import { execute as timelineHeaderIconDragLeaveService } from "../service/TimelineHeaderIconDragLeaveService";
import { execute as timelineHeaderIconDropUseCase } from "./TimelineHeaderIconDropUseCase";
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
            timelineHeaderScriptIconMouseDownEventService
        );

        // ドラッグエンドイベント
        scriptElement.addEventListener("dragend",
            timelineHeaderIconDragEndEventService
        );
    }

    // ラベルアイコン
    const labelElement = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
    if (labelElement) {
        labelElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderLabelIconMouseDownEventService
        );

        // ドラッグエンドイベント
        labelElement.addEventListener("dragend",
            timelineHeaderIconDragEndEventService
        );
    }

    // サウンドアイコン
    const soundElement = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
    if (soundElement) {
        soundElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderSoundIconMouseDownEventService
        );

        // ドラッグエンドイベント
        soundElement.addEventListener("dragend",
            timelineHeaderIconDragEndEventService
        );
    }

    // drop & drag イベント
    element.addEventListener("dragenter", timelineHeaderIconDragEnterService);
    element.addEventListener("dragover", timelineHeaderIconDragOverService);
    element.addEventListener("dragleave", timelineHeaderIconDragLeaveService);
    element.addEventListener("drop", timelineHeaderIconDropUseCase);
};