import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderMenuShowUseCase } from "./TimelineHeaderMenuShowUseCase";
import { execute as timelineHeaderScriptAddPointerDownEventUseCase } from "./TimelineHeaderScriptAddPointerDownEventUseCase";
import { execute as timelineHeaderMenuTouchPointerDownUseCase } from "./TimelineHeaderMenuTouchPointerDownUseCase";
import { execute as timelineHeaderMenuTouchPointerUpService } from "../service/TimelineHeaderMenuTouchPointerUpService";
import {
    $TIMELINE_CONTROLLER_BASE_ID,
    $TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID
} from "@/config/TimelineConfig";

/**
 * @description タイムラインヘッダーのイベント登録関数
 *              Timeline header event registration functions
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (!element) {
        return ;
    }

    element.addEventListener("contextmenu", timelineHeaderMenuShowUseCase);

    // タッチデバイスのタッチイベント
    element.addEventListener(
        EventType.POINTER_DOWN,
        timelineHeaderMenuTouchPointerDownUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineHeaderMenuTouchPointerUpService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        timelineHeaderMenuTouchPointerUpService,
        { "passive": false }
    );

    // スクリプト追加ボタンにイベントを登録
    const scriptElement: HTMLElement | null = document
        .getElementById($TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID);

    if (scriptElement) {
        scriptElement.addEventListener(EventType.POINTER_DOWN,
            timelineHeaderScriptAddPointerDownEventUseCase,
            { "passive": false }
        );
    }
};