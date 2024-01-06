import { $TIMELINE_CONTROLLER_BASE_ID, $TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID } from "@/config/TimelineConfig";
import { execute as timelineHeaderMenuShowService } from "../service/TimelineHeaderMenuShowService";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderScriptAddMouseDownEventUseCase } from "./TimelineHeaderScriptAddMouseDownEventUseCase";

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

    element.addEventListener("contextmenu", timelineHeaderMenuShowService);

    // スクリプト追加ボタンにイベントを登録
    const scriptElement: HTMLElement | null = document
        .getElementById($TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID);

    if (scriptElement) {
        scriptElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderScriptAddMouseDownEventUseCase
        );
    }
};